import { HttpStatusCode } from "../utils/constants/index.js";
import { BaseError } from "./BaseError.js";

export class UnprocessableEntityError extends BaseError {
  constructor(message: string) {
    super(
      "Unprocessable Entity",
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      message,
      true
    );
  }
}
