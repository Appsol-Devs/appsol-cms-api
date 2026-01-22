import type { ITicket, ITicketHistory } from "../../../entities/Ticket.js";
import type { IBaseInteractor } from "../base/IBaseInteractor.js";

export interface ITicketInteractor extends IBaseInteractor<ITicket> {

  closeTicket(id: string): Promise<ITicket>;

  assignTicket(data: ITicketHistory, id: string): Promise<ITicket>;


}
