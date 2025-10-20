import type { Request } from "express";
import { IUser } from "../../../entities/User.js";

export interface IControllerUserRequest extends Request {
  user?: IUser;
}
