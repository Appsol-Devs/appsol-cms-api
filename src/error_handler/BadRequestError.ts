import { HttpStatusCode } from "../utils/constants/enums.js";
import { BaseError } from "./BaseError.js";

export class BadRequestError extends BaseError {
  constructor(description = "Bad Request") {
    super("Bad Request", HttpStatusCode.BAD_REQUEST, description, true);
  }
}
