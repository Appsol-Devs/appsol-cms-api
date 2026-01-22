import { injectable, inject, Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type { IExpressApp } from "./app.js";
import type { IServer } from "./server.js";
import type { IDatabaseConnection } from "../mongodb/connection.js";
import type { ILogger } from "../logging/ILogger.js";

export interface IApplication {
  start(): Promise<void>;
  shutdown(): Promise<void>;
}

@injectable()
export class Application implements IApplication {
  constructor(
    @inject(INTERFACE_TYPE.ExpressApp) private expressApp: IExpressApp,
    @inject(INTERFACE_TYPE.Server) private server: IServer,
    @inject(INTERFACE_TYPE.DatabaseConnection)
    private database: IDatabaseConnection,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger,
    @inject(INTERFACE_TYPE.Container) private container: Container,
  ) {}

  public async start(): Promise<void> {
    try {
      // Configure Express app
      this.expressApp.configure(this.container);
      this.logger.info("Express app configured");

      // Connect to database
      await this.database.connectToMongo();

      // Start server
      this.server.startServer();
      this.logger.info("Application started successfully");
    } catch (error) {
      this.logger.error("Failed to start application:", error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.database.disconnect();
      this.logger.info("Application shut down successfully");
    } catch (error) {
      this.logger.error("Error during shutdown:", error);
      throw error;
    }
  }
}
