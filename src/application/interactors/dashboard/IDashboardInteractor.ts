import type {
  IDashbaordRequest,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
  IDashboardOperationalInsights,
} from "../../../entities/Dashboard.js";

export interface IDashboardInteractor {
  getSummary(data: IDashbaordRequest): Promise<IDashboardSummary>;
  getWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend>;
  getOperationalInsights(): Promise<IDashboardOperationalInsights>;
}
