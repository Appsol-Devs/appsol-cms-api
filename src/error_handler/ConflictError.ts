import { HttpStatusCode } from "../utils/constants/index.js";
import { BaseError } from "./BaseError.js";

export class ConflictError extends BaseError {
  constructor(message: string) {
    super("Not Found", HttpStatusCode.CONFLICT, message, true);
  }
}
