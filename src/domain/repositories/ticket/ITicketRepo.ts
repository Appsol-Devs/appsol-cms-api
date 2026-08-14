import type { ITicket } from "../../../entities/Ticket.js";
import type { IBaseRepository } from "../base/IBaseRepository.js";

export interface ITicketRepo extends IBaseRepository<ITicket> {
  closeTicket(id: string): Promise<ITicket>;
}
