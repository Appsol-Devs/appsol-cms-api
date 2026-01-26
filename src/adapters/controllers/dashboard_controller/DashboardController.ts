import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { type IDashboardInteractor } from "../../../application/interactors/dashboard/IDashboardInteractor.js";
import type { Request, Response, NextFunction } from "express";
import { type IDashbaordRequest } from "../../../entities/Dashboard.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";

@injectable()
export class DashboardController {
  constructor(
    @inject(INTERFACE_TYPE.DashboardInteractorImpl)
    private dashboardInteractor: IDashboardInteractor,
  ) {
    this.dashboardInteractor = dashboardInteractor;
  }

  async getDashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const query: IDashbaordRequest = {
        startDate: req.query.startDate as string | null,
        endDate: req.query.endDate as string | null,
      };
      const summary = await this.dashboardInteractor.getSummary(query);
      res.status(HttpStatusCode.OK).json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyRevenueTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const query: IDashbaordRequest = {
        startDate: req.query.startDate as string | null,
        endDate: req.query.endDate as string | null,
      };
      const trends =
        await this.dashboardInteractor.getWeeklyRevenueTrend(query);
      res.status(HttpStatusCode.OK).json(trends);
    } catch (error) {
      next(error);
    }
  }

  async getOperationalInsights(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const insights = await this.dashboardInteractor.getOperationalInsights();
      res.status(HttpStatusCode.OK).json(insights);
    } catch (error) {
      next(error);
    }
  }
}
