import type { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import type { ILogger } from "../../logging/index.js";
import { BaseError } from "../../../error_handler/BaseError.js";
import {
  HttpStatusCode,
  INTERFACE_TYPE,
} from "../../../utils/constants/index.js";

@injectable()
export class ErrorMiddleware {
  // private errorHandler: IErrorHandler;
  private logger: ILogger;

  constructor(@inject(INTERFACE_TYPE.Logger) logger: ILogger) {
    this.logger = logger;
  }

  // This middleware will be responsible for catching an error and sending a response
  execute() {
    return (
      err: Error,
      req: Request,
      res: Response,
      _next: NextFunction
    ): void => {
      // Log the error details
      this.logger.error("Error processing request", {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        errorMessage: err.message,
      });

      // Handle specific errors
      console.log(err);
      if (err instanceof BaseError) {
        const { statusCode, message, stack } = err;
        this.logger.error("BaseError", { stack, message, statusCode });
        res.status(err.statusCode).json({
          stack,
          message,
          messages: (() => {
            try {
              // Attempt to parse the message
              const parsed = JSON.parse(err.message);

              // Check if the parsed result is an array
              if (Array.isArray(parsed)) {
                return parsed;
              }

              // If it's not an array, wrap it in one
              return [parsed];
            } catch (e) {
              // If JSON.parse fails, it's not a JSON object.
              // So, we treat the original message as a simple string
              // and wrap it in an array for consistent output.
              return [err.message];
            }
          })(), // Immediately invoke the function to get the value
          statusCode,
        });
      } else {
        // Handle other types of errors
        this.logger.error("Internal Server Error", err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          stack: err.stack,
          message: "Internal Server Error",
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }
}
