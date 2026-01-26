import type { TCustomerComplaintStatus } from "./index.js";
import type { TTicketStatus } from "./Ticket.js";

export class IDashboardSummary {
  constructor(
    public  openIssuesCount?: number,
    public  revenue?: number,
    public  activeSubscriptions?: number,
    public  leadGrowthPercentage?: string,
  ) {}
}
export class IDashboardOperationalInsights {
  constructor(
    public  complaints?: TComplaintInsights,
    public  tickets?: TTicketInsights,
  ) {}
}

export class IDashboardWeeklyRevenueTrend {
  constructor(
    public  dates?: string[],
    public  revenues?: number[],
  ) {}
}

type TComplaintInsights = Record<TCustomerComplaintStatus, number>;

type TTicketInsights = Record<TTicketStatus, number>;

export interface IDashbaordRequest{
  startDate?: string | null ;
  endDate?: string | null ;
}
