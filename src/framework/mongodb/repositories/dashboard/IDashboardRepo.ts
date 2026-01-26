import type {
  IDashbaordRequest,
  IDashboardOperationalInsights,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
} from "../../../../entities/Dashboard.js";

export interface IDashboardRepo {
  aggregateSummary(data: IDashbaordRequest): Promise<IDashboardSummary>;
  aggregateWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend>;
  aggregateOperationalInsights(): Promise<IDashboardOperationalInsights>;
}
