import { inject } from "inversify";
import type {
  ICustomerComplaint,
  IUser,
  TTicketStatus,
} from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type {
  IBaseRepository,
  ITicketRepo,
  TicketRepositoryImpl,
} from "../../../framework/mongodb/index.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../../../error_handler/index.js";
import type { IMailer } from "../../../framework/services/index.js";
import { ticketAssignmentTemplate } from "../../../utils/mail_templates/ticketAssignment.js";
import type { ITicketInteractor } from "./TicketInteractor.js";

import type { ITicket, ITicketHistory } from "../../../entities/Ticket.js";

export class TicketInteractorImpl
  extends BaseInteractorImpl<ITicket>
  implements ITicketInteractor
{
  constructor(
    // @inject(INTERFACE_TYPE.TicketRepositoryImpl)
    // TicketRepositoryImpl: TicketRepositoryImpl,
    @inject(INTERFACE_TYPE.Mailer) private mailer: IMailer,
    @inject(INTERFACE_TYPE.TicketRepositoryImpl)
    private readonly ticketRepo: ITicketRepo,
  ) {
    super(ticketRepo);
    this.mailer = mailer;
    this.ticketRepo = ticketRepo;
  }
  async closeTicket(id: string): Promise<ITicket> {
    const ticket = await this.repository.getById(id);
    if (!ticket) throw new BadRequestError("Ticket not found");
    if (ticket.status === "closed")
      throw new BadRequestError("Ticket already closed");
    const updatedTicket = await this.ticketRepo.closeTicket(ticket._id!);
    if (!updatedTicket) throw new BadRequestError("Failed to close ticket");
    return updatedTicket;
  }
  async assignTicket(data: ITicketHistory, id: string): Promise<ITicket> {
    if (!data || data.to == null)
      throw new UnprocessableEntityError("Invalid ticket payload");
    const ticket = await this.repository.getById(id);
    if (!ticket) throw new BadRequestError("Ticket not found");
    let paylaod: ITicket = {};
    const newHistory = ticket.history;
    if (ticket.assignedEngineerId) {
      // reassign
      const newEngineer: ITicketHistory = {
        date: new Date().toISOString(),
        from: data.from,
        to: data.to,
        reason: data.reason || "",
      };
      newHistory?.unshift(newEngineer);
      paylaod = {
        history: newHistory,
        assignedEngineerId: data.to as string,
      };
    } else {
      paylaod = {
        assignedEngineerId: data.to as string,
      };
    }
    const updatedTicket = await this.repository.update(ticket._id!, paylaod);
    if (!updatedTicket) throw new BadRequestError("Failed to assign engineer");
    this.sendMail(updatedTicket);
    return updatedTicket;
  }

  async create(data: ITicket): Promise<ITicket> {
    if (!data) throw new UnprocessableEntityError("Data is required");
    const ticket = await this.repository.findOne({
      complaint: data.complaintId,
    });
    if (ticket)
      throw new BadRequestError("Ticket already exists for complaint");
    let status: TTicketStatus = "open";
    if (data.assignedEngineerId) status = "assigned";
    const ticketData: ITicket = {
      ...data,
      status: status,
    };
    const res = await this.repository.create(ticketData);
    if (!res) throw new BadRequestError("Error creating ticket");
    // Send assignment email if assignedEngineerId is present
    if (data.assignedEngineerId) {
      this.sendMail(res);
    }

    return res;
  }

  async sendMail(res: ITicket) {
    const complaint = res.complaint as ICustomerComplaint;
    const clientName =
      typeof complaint.customer === "object" && complaint.customer !== null
        ? `${complaint.customer.name} | ${complaint.customer.companyName}`
        : "Client";
    const mail = ticketAssignmentTemplate({
      clientName: clientName || "Client",
      engineerName:
        `${(res.assignedEngineer as IUser)?.firstName || "Engineer"} ${(res.assignedEngineer as IUser)?.lastName || ""}`.trim(),
      ticketId: res.ticketCode || "",
      title: res.title || "",
      priority: res.priority || "low",
      deadline: res.requestedDate || "",
    });
    this.mailer.sendEmail(
      (res.assignedEngineer as IUser).email!,
      "New Ticket",
      mail,
    );
  }
}
