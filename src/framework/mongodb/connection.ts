//data base connection
import { Mongoose } from "mongoose";
import type { IConfig } from "../../config/IConfig.js";
import type { ILogger } from "../logging/ILogger.js";

export default function connection(
  mongoose: Mongoose,
  config: IConfig,
  logger: ILogger
) {
  function connectToMongo() {
    mongoose
      .connect(config.mongo.uri)
      .then(
        () => {},
        (err) => {
          logger.error("Mongodb error", err);
        }
      )
      .catch((err) => {
        logger.error("ERROR:", err);
      });
  }

  mongoose.connection.on("connected", () => {
    logger.info("Connected to MongoDB! 🗄️✅");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected!🗄️✅");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`Error in MongoDb connection: ${error}`);

    mongoose.disconnect();
  });

  mongoose.connection.on("disconnected", () => {
    logger.error("MongoDB disconnected!🗄️❌");
  });

  return {
    connectToMongo,
  };
}
