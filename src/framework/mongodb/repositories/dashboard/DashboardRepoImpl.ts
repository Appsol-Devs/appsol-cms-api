import {
  IDashboardOperationalInsights,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
  type IDashbaordRequest,
} from "../../../../entities/Dashboard.js";
import type { IDashboardRepo } from "./IDashboardRepo.js";
import {
  PaymentModel,
  SubscriptionModel,
  LeadModel,
  CustomerComplaintModel,
  TicketModel,
} from "../../models/index.js";
import { injectable } from "inversify";
import {
  COMPLAINT_STATUSES,
  type TCustomerComplaintStatus,
} from "../../../../entities/CustomerComplaint.js";
import {
  TICKET_STATUSES,
  type TTicketStatus,
} from "../../../../entities/Ticket.js";
import { initStatusMap } from "../../../../utils/helpers.js";

@injectable()
export class DashboardRepoImpl implements IDashboardRepo {
  async aggregateSummary(data: IDashbaordRequest): Promise<IDashboardSummary> {
    try {
      const now = new Date();
      const start = data.startDate ? new Date(data.startDate) : new Date(now);
      const end = data.endDate ? new Date(data.endDate) : new Date(now);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      // Open issues: complaints that are not resolved/closed
      const openIssuesCount = await CustomerComplaintModel.countDocuments({
        status: { $in: ["open", "in-progress", "rescheduled"] },
      });

      // Revenue: sum of approved or generated payments
      const revenueAgg = await PaymentModel.aggregate([
        {
          $match: {
            status: { $in: ["approved", "generated"] },
            createdAt: { $gte: start, $lte: data.endDate ? end : now },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const revenue = revenueAgg[0]?.total ?? 0;

      // Active subscriptions
      const activeSubscriptions = await SubscriptionModel.countDocuments({
        status: "active",
      });

      // Lead growth percentage: compare last 30 days vs previous 30 days
      const endOfToday = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      );

      // Last 30 days (inclusive)
      const last30Start = new Date(endOfToday);
      last30Start.setUTCDate(last30Start.getUTCDate() - 29);
      last30Start.setUTCHours(0, 0, 0, 0);

      // Previous 30 days
      const prev30End = new Date(last30Start);
      prev30End.setUTCMilliseconds(-1);

      const prev30Start = new Date(prev30End);
      prev30Start.setUTCDate(prev30Start.getUTCDate() - 29);
      prev30Start.setUTCHours(0, 0, 0, 0);

      const [currentAgg, prevAgg] = await Promise.all([
        LeadModel.countDocuments({
          createdAt: { $gte: last30Start, $lte: endOfToday },
        }),
        LeadModel.countDocuments({
          createdAt: { $gte: prev30Start, $lte: prev30End },
        }),
      ]);
      const currentCount = currentAgg;
      const prevCount = prevAgg;

      let leadGrowthPercentage: string;

      if (prevCount === 0 && currentCount === 0) {
        leadGrowthPercentage = "0";
      } else if (prevCount === 0 && currentCount > 0) {
        leadGrowthPercentage = "100";
      } else {
        const pct = ((currentCount - prevCount) / prevCount) * 100;
        leadGrowthPercentage = `${pct.toFixed(1)}`;
      }

      return new IDashboardSummary(
        openIssuesCount,
        revenue,
        activeSubscriptions,
        leadGrowthPercentage,
      );
    } catch (error) {
      throw error;
    }
  }

  async aggregateWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend> {
    try {
      const now = data.startDate || new Date();
      const startDate = new Date(now);

      // normalize to end of day UTC (important)
      const end = new Date(
        Date.UTC(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth(),
          startDate.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      );

      // 6 days BEFORE startDate (inclusive = 7 days total)
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 6);
      start.setUTCHours(0, 0, 0, 0);

      const payments = await PaymentModel.aggregate([
        // 1️⃣ Match payments in range
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: ["approved", "generated"] },
          },
        },

        // 2️⃣ Group by day (UTC-safe)
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            total: { $sum: "$amount" },
          },
        },

        // 3️⃣ Convert to lookup-friendly format
        {
          $project: {
            _id: 0,
            date: "$_id",
            total: 1,
          },
        },

        // 4️⃣ Build full 7-day range
        {
          $facet: {
            data: [{ $sort: { date: 1 } }],
            days: [
              {
                $project: {
                  dates: {
                    $map: {
                      input: { $range: [0, 7] },
                      as: "i",
                      in: {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          timezone: "UTC",
                          date: {
                            $dateSubtract: {
                              startDate: end,
                              unit: "day",
                              amount: "$$i",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },

        // 5️⃣ Merge real data with zero-filled days
        {
          $project: {
            merged: {
              $map: {
                input: { $arrayElemAt: ["$days.dates", 0] },
                as: "date",
                in: {
                  date: "$$date",
                  total: {
                    $ifNull: [
                      {
                        $first: {
                          $map: {
                            input: {
                              $filter: {
                                input: "$data",
                                cond: { $eq: ["$$this.date", "$$date"] },
                              },
                            },
                            as: "d",
                            in: "$$d.total",
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },

        // 6️⃣ Final shape
        { $unwind: "$merged" },
        { $replaceRoot: { newRoot: "$merged" } },
        { $sort: { date: 1 } },
      ]);

      const dates = payments.map((p) => p.date);
      const revenues = payments.map((p) => p.total);

      return new IDashboardWeeklyRevenueTrend(dates, revenues);
    } catch (error) {
      throw error;
    }
  }

  async aggregateOperationalInsights(): Promise<IDashboardOperationalInsights> {
    try {
      const complaintsAgg = await CustomerComplaintModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const ticketsAgg = await TicketModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const complaints = initStatusMap(COMPLAINT_STATUSES);
      for (const c of complaintsAgg) {
        complaints[c._id as TCustomerComplaintStatus] = c.count;
      }

      const tickets = initStatusMap(TICKET_STATUSES);
      for (const t of ticketsAgg) {
        tickets[t._id as TTicketStatus] = t.count;
      }
      return new IDashboardOperationalInsights(
        complaints as IDashboardOperationalInsights["complaints"],
        tickets as IDashboardOperationalInsights["tickets"],
      );
    } catch (error) {
      throw error;
    }
  }
}
