// framework/webserver/middleware/ApiKeyMiddleware.ts
import { injectable, inject } from "inversify";
import type { Request, Response, NextFunction } from "express";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { IConfig } from "../../../config/IConfig.js";
import type { ILogger } from "../../logging/ILogger.js";
import { HttpStatusCode } from "../../../utils/constants/index.js";
import { UnauthorizedError } from "../../../error_handler/UnauthorizedError.js";

@injectable()
export class ApiKeyMiddleware {
  constructor(
    @inject(INTERFACE_TYPE.IConfig) private config: IConfig,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger
  ) {}

  execute(req: Request, _res: Response, next: NextFunction) {
    this.logger.info("Validating internal API key");
    try {
      const apiKey = req.header("x-api-key") || req.query.apiKey;

      if (!apiKey) {
        this.logger.warn("API key missing in request");
        return next(new UnauthorizedError("API key missing in request"));
      }

      if (apiKey !== this.config.internalApiKey) {
        this.logger.warn(`Invalid API key attempt: ${apiKey}`);
        return next(new UnauthorizedError("Invalid API key"));
      }

      this.logger.info("Internal API key validated");
      next();
    } catch (error) {
      return next(new UnauthorizedError(error as unknown as string));
    }
  }
}
