import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { UnprocessableEntityError } from "../../../error_handler/UnprocessableEntityError.js";

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Use safeParse to avoid throwing an error immediately
      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        throw new UnprocessableEntityError(
          //"Validation failed"
          JSON.stringify(validationResult.error.issues)
        );
      }

      // Replace req.body with the validated data
      req.body = validationResult.data;
      next();
    } catch (error) {
      next(error); // Pass the error to the Express error handler
    }
  };
