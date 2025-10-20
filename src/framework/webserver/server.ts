//handle server configs here

import type { Express } from "express";
import type { IConfig } from "../../config/IConfig.js";
import type { ILogger } from "../logging/ILogger.js";
const serverConfig = (app: Express | any, config: IConfig, logger: ILogger) => {
  const startServer = () => {
    app.listen(config.port, () => {
      logger.info(`Server listening on Port ${config.port}`);
    });
  };
  return { startServer };
};

export default serverConfig;
