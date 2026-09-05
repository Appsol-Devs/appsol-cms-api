import { injectable, inject } from "inversify";
import type { IConfig } from "../../config/IConfig.js";
import type { ILogger } from "../logging/ILogger.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import { prisma } from "./utils/prisma.js";

export interface IDatabaseConnection {
  connectToMongo(): Promise<void>;
  connectToPostgres(): Promise<void>;
  disconnect(): Promise<void>;
}

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  constructor(
    @inject(INTERFACE_TYPE.IConfig) private config: IConfig,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger,
  ) {}

  public async connectToMongo(): Promise<void> {
    this.logger.info("MongoDB connection setup is preserved for legacy use.");
  }

  public async connectToPostgres(): Promise<void> {
    try {
      await prisma.$connect();
      this.logger.info("Connected to PostgreSQL successfully🗄️✅");
    } catch (error) {
      this.logger.error("PostgreSQL connection error:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
      this.logger.info("Disconnected from PostgreSQL🗄️❌");
    } catch (error) {
      this.logger.error("PostgreSQL disconnection error:", error);
      throw error;
    }
  }
}
