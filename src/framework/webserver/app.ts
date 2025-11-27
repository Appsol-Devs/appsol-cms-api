// app.ts
import { injectable, inject, Container } from "inversify";
import express, { type Express } from "express";
import cors from "cors";
import routes, { createRoutes } from "./routes/index.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";

export interface IExpressApp {
  getApp(): Express;
  configure(container: Container): void;
}

@injectable()
export class ExpressApp implements IExpressApp {
  private app: Express;

  constructor(
    @inject(INTERFACE_TYPE.ErrorMiddleWare)
    private errorMiddleware: ErrorMiddleware
  ) {
    this.app = express();
  }

  public configure(container: Container): void {
    this.setupMiddlewares();
    this.setupCors();
    this.setupRoutes(container);
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json({ limit: "5mb" }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupCors(): void {
    this.app.use(
      cors({
        origin: "*",
        exposedHeaders: [
          "Content-Length",
          "x-pagination",
          "x-total-amount",
          "x-total-approved",
          "x-total-pending",
        ],
      })
    );
  }

  private setupRoutes(container: Container): void {
    const router = createRoutes(container);
    this.app.use(router);
  }

  private setupErrorHandling(): void {
    this.app.use(this.errorMiddleware.execute().bind(this.errorMiddleware));
  }

  public getApp(): Express {
    return this.app;
  }
}
