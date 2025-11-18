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
          message: (() => {
            // 1. Attempt to parse the message
            // Use the original err.message directly, not the parsed version
            const originalMessage: string = err.message;

            // Check for common JWT errors
            if (originalMessage.includes("jwt expired")) {
              return "Your session has expired. Please log in again.";
            }
            if (originalMessage.includes("JsonWebTokenError")) {
              return "Authentication failed. The token is invalid or malformed.";
            }

            // --- handle complex JSON errors (like validation arrays) ---
            try {
              const parsedMessage = JSON.parse(originalMessage);

              // Check for array of validation errors
              if (Array.isArray(parsedMessage)) {
                return "One or more validation errors occurred. Please check your input.";
              }

              // If it was a valid JSON object but not an array, just return the original message
              return originalMessage;
            } catch (e) {
              // If JSON.parse fails, it was a simple string error (which we already checked for above),
              // or a completely unexpected error. Just return the original message.
              return originalMessage;
            }
          })(),
          messages: (() => {
            try {
              // 1. Attempt to parse the message
              const parsed = JSON.parse(err.message);

              // 2. Check if the parsed result is an array (e.g., from Zod)
              if (Array.isArray(parsed)) {
                // 3. MAP the array of objects to an array of simple strings
                return parsed.map((errorObject) => {
                  // Extract the field path and the specific error message
                  const path = errorObject.path.join(".");
                  const message = errorObject.message;

                  // Construct a single, readable string
                  return `${path}: ${message}`;
                });
              }

              // If it's not a parsable array, wrap the whole message in a string array
              return [String(parsed)];
            } catch (e) {
              // If JSON.parse fails, treat the original message as a simple string
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
