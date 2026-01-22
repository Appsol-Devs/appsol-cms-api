import type { ITicket } from "../../../../entities/Ticket.js";
import type { IBaseRepository } from "../base/index.js";

export interface ITicketRepo extends IBaseRepository<ITicket> {
  closeTicket(id: string): Promise<ITicket>;
}
