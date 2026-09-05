import { type IDashboardRepo } from "./../../../../domain/repositories/dashboard/IDashboardRepo.js";
import { injectable } from "inversify";
import {
  IDashboardOperationalInsights,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
  type IDashbaordRequest,
} from "../../../../entities/Dashboard.js";
import { prisma } from "../../utils/prisma.js";
import { COMPLAINT_STATUSES } from "../../../../entities/CustomerComplaint.js";
import { TICKET_STATUSES } from "../../../../entities/Ticket.js";
import { initStatusMap } from "../../../../utils/helpers.js";

@injectable()
export class DashboardRepositoryImpl implements IDashboardRepo {
  async aggregateSummary(data: IDashbaordRequest): Promise<IDashboardSummary> {
    const now = new Date();
    const start = data.startDate ? new Date(data.startDate) : new Date(now);
    const end = data.endDate ? new Date(data.endDate) : new Date(now);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const openIssuesCount = await prisma.customerComplaint.count({
      where: { status: { in: ["open", "in-progress", "rescheduled"] } },
    });

    const revenueAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: { in: ["approved", "generated"] },
        createdAt: { gte: start, lte: data.endDate ? end : now },
      },
    });
    const revenue = (revenueAgg._sum?.amount as number) ?? 0;

    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "active" },
    });

    // lead growth
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
    const last30Start = new Date(endOfToday);
    last30Start.setUTCDate(last30Start.getUTCDate() - 29);
    last30Start.setUTCHours(0, 0, 0, 0);

    const prev30End = new Date(last30Start);
    prev30End.setUTCMilliseconds(-1);

    const prev30Start = new Date(prev30End);
    prev30Start.setUTCDate(prev30Start.getUTCDate() - 29);
    prev30Start.setUTCHours(0, 0, 0, 0);

    const [currentCount, prevCount] = await Promise.all([
      prisma.lead.count({
        where: { createdAt: { gte: last30Start, lte: endOfToday } },
      }),
      prisma.lead.count({
        where: { createdAt: { gte: prev30Start, lte: prev30End } },
      }),
    ]);

    let leadGrowthPercentage: string;
    if (prevCount === 0 && currentCount === 0) leadGrowthPercentage = "0";
    else if (prevCount === 0 && currentCount > 0) leadGrowthPercentage = "100";
    else {
      const pct = ((currentCount - prevCount) / prevCount) * 100;
      leadGrowthPercentage = `${pct.toFixed(1)}`;
    }

    return new IDashboardSummary(
      openIssuesCount,
      revenue,
      activeSubscriptions,
      leadGrowthPercentage,
    );
  }

  async aggregateWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend> {
    const now = new Date(data.startDate ?? new Date()) || new Date();
    const end = new Date(
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
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    start.setUTCHours(0, 0, 0, 0);

    const days: string[] = [];
    const revenues: number[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const dayStart = new Date(d);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

      const agg = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: dayStart, lt: dayEnd },
          status: { in: ["approved", "generated"] },
        },
      });
      days.push(dayStart.toISOString().slice(0, 10));
      revenues.push((agg._sum?.amount as number) ?? 0);
    }

    return new IDashboardWeeklyRevenueTrend(days, revenues);
  }

  async aggregateOperationalInsights(): Promise<IDashboardOperationalInsights> {
    const complaintsAgg = await prisma.customerComplaint.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    const ticketsAgg = await prisma.ticket.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const complaints = initStatusMap(COMPLAINT_STATUSES);
    for (const c of complaintsAgg) {
      (complaints as any)[c.status] = c._count?.status ?? 0;
    }

    const tickets = initStatusMap(TICKET_STATUSES);
    for (const t of ticketsAgg) {
      (tickets as any)[t.status] = t._count?.status ?? 0;
    }

    return new IDashboardOperationalInsights(complaints as any, tickets as any);
  }
}
