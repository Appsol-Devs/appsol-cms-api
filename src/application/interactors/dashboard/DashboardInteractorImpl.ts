import { inject, injectable } from "inversify";
import type {
  IDashbaordRequest,
  IDashboardSummary,
  IDashboardWeeklyRevenueTrend,
  IDashboardOperationalInsights,
} from "../../../entities/Dashboard.js";
import type { IDashboardInteractor } from "./IDashboardInteractor.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { IDashboardRepo } from "../../../framework/index.js";

@injectable()
export class DashboardInteractorImpl implements IDashboardInteractor {
  constructor(
    @inject(INTERFACE_TYPE.DashboardRepoImpl)
    private dashboardRepo: IDashboardRepo,
  ) {
    this.dashboardRepo = dashboardRepo;
  }
  async getSummary(data: IDashbaordRequest): Promise<IDashboardSummary> {
    return this.dashboardRepo.aggregateSummary(data);
  }
  async getWeeklyRevenueTrend(
    data: IDashbaordRequest,
  ): Promise<IDashboardWeeklyRevenueTrend> {
    return this.dashboardRepo.aggregateWeeklyRevenueTrend(data);
  }
  async getOperationalInsights(): Promise<IDashboardOperationalInsights> {
    return this.dashboardRepo.aggregateOperationalInsights();
  }
}
