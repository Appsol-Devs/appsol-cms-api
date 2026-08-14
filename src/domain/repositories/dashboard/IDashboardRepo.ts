import type {
  IDashbaordRequest,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
  IDashboardOperationalInsights,
} from "../../../entities/Dashboard.js";

export interface IDashboardRepo {
  aggregateSummary(data: IDashbaordRequest): Promise<IDashboardSummary>;
  aggregateWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend>;
  aggregateOperationalInsights(): Promise<IDashboardOperationalInsights>;
}
