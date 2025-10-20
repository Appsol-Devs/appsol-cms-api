import { HttpStatusCode } from "../utils/constants/index.js";
import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super("Not Found", HttpStatusCode.NOT_FOUND, message, true);
  }
}
