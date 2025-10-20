import { HttpStatusCode } from "../utils/constants/enums.js";
import { BaseError } from "./BaseError.js";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super("Unauthorized", HttpStatusCode.UNAUTHORIZED, message, true);
  }
}
