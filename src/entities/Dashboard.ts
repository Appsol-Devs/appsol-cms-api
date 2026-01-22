import type { TCustomerComplaintStatus } from "./index.js";
import type { TTicketStatus } from "./Ticket.js";

export class IDashboardSummary {
  constructor(
    public readonly openIssuesCount?: number,
    public readonly revenue?: number,
    public readonly activeSubscriptions?: number,
    public readonly leadGrowthPercentage?: string,
  ) {}
}
export class IDashboardOperationalInsights {
  constructor(
    public readonly complaints?: TComplaintInsights,
    public readonly tickets?: TTicketInsights,
  ) {}
}

export class IDashboardWeeklyRevenueTrend {
  constructor(
    public readonly dates?: string[],
    public readonly revenues?: number[],
  ) {}
}

type TComplaintInsights = Record<TCustomerComplaintStatus, number>;

type TTicketInsights = Record<TTicketStatus, number>;
