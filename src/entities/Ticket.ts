import type { TPriority } from "../utils/constants/genTypes.js";
import type { ICustomerComplaint, ISoftware } from "./index.js";
import type { IUser, RequestQuery } from "./User.js";

export class ITicket {
  constructor(
    public readonly _id?: string,
    public readonly ticketCode?: string,
    public readonly title?: string,
    public readonly complaintId?: string,
    public complaint?: ICustomerComplaint | string,
    public readonly assignedEngineerId?: string,
    public assignedEngineer?: IUser | string,
    public readonly requestedDate?: string,
    public readonly notes?: string,
    public readonly rejectionReason?: string,
    public readonly priority?: TPriority,
    public readonly status?: TTicketStatus,
    public readonly history?: Array<ITicketHistory>,
    public loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}
}

export type TTicketStatus =
  | "open"
  | "assigned"
  | "fixed"
  | "closed"
  | "rejected";

export interface ITicketHistory {
  from: IUser | string | undefined | null;
  to: IUser | string;
  date: string;
  reason?: string;
}

export interface ITicketRequestQuery extends RequestQuery {
  status?: TTicketStatus | undefined;
  priority?: TPriority | undefined;
  assignedEngineerId?: string | undefined;
  complaintId?: string | undefined;
  loggedById?: string | undefined;
}
