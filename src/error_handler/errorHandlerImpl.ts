import { injectable } from "inversify";

import { BaseError } from "./BaseError.js";
import type { IErrorHandler } from "./IErrorHandler.js";
import { logger } from "../framework/logging/index.js";

@injectable()
export class ErrorHandlerImpl implements IErrorHandler {
  async handleError(err: Error): Promise<void> {
    await logger.error("An error occured", err);
    //TODO Add sentry
  }

  isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
