// framework/mongodb/connection.ts
import { injectable, inject } from "inversify";
import type { Mongoose } from "mongoose";
import type { IConfig } from "../../config/IConfig.js";
import type { ILogger } from "../logging/ILogger.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";

export interface IDatabaseConnection {
  connectToMongo(): Promise<void>;
  disconnect(): Promise<void>;
}

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  constructor(
    @inject(INTERFACE_TYPE.Mongoose) private mongoose: Mongoose,
    @inject(INTERFACE_TYPE.IConfig) private config: IConfig,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger
  ) {}

  public async connectToMongo(): Promise<void> {
    try {
      await this.mongoose.connect(this.config.mongo.uri, {
        // Add your mongoose options here
      });
      this.logger.info("Connected to MongoDB successfully🗄️✅");
    } catch (error) {
      this.logger.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.mongoose.disconnect();
      this.logger.info("Disconnected from MongoDB🗄️❌");
    } catch (error) {
      this.logger.error("MongoDB disconnection error:", error);
      throw error;
    }
  }

  public async reconnect(): Promise<void> {
    try {
      this.mongoose.connection.on("reconnected", () => {
        this.logger.error("MongoDB reconnected !🗄️✅");
      });
    } catch (error) {
      this.logger.error("MongoDB connection error:", error);
      throw error;
    }
  }
}
