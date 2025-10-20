import { BaseError } from "./BaseError.js";
import { HttpStatusCode } from "../utils/constants/enums.js";

export class APIError extends BaseError {
  constructor(
    name: string,
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    description = "Internal server error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}
