import { inject } from "inversify";
import type {
  ICustomer,
  ICustomerComplaint,
  ITicket,
  IUser,
  TTicketStatus,
} from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { TicketRepositoryImpl } from "../../../framework/mongodb/index.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../../../error_handler/index.js";
import type { IMailer } from "../../../framework/services/index.js";
import { ticketAssignmentTemplate } from "../../../utils/mail_templates/ticketAssignment.js";

export class TicketInteractorImpl extends BaseInteractorImpl<ITicket> {
  constructor(
    @inject(INTERFACE_TYPE.TicketRepositoryImpl)
    TicketRepositoryImpl: TicketRepositoryImpl,
    @inject(INTERFACE_TYPE.Mailer) private mailer: IMailer,
  ) {
    super(TicketRepositoryImpl);
    this.mailer = mailer;
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
    if (!res) throw new BadRequestError("Error creating item");
    // Send assignment email if assignedEngineerId is present
    if (data.assignedEngineerId) {
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

    return res;
  }
}
