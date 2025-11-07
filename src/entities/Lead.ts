import type { ILeadNextStep } from "./lookups/LeadNextStep.js";
import type { ILeadStatus } from "./lookups/LeadStatus.js";

import type { IUser, RequestQuery } from "./User.js";

export class ILead {
  constructor(
    public readonly _id?: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly companyName?: string,
    public readonly leadSource?: string,
    public readonly initialEnquiryDate?: string,
    public readonly leadStatus?: `${LeadStatus}`,
    public readonly loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
    public readonly leadStage?: ILeadStatus | string,
    public readonly priority?: LeadPriority,
    public readonly nextStep?: ILeadNextStep | string,
    public readonly location?: string,
    public readonly notes?: string,
    public readonly geolocation?: IGeolocation
  ) {}
}

export interface IGeolocation {
  address: string;
  long: Number;
  lat: Number;
}

export interface ILeadRequestQuery extends RequestQuery {
  leadSource?: string | undefined;
  leadStatus?: string | undefined;
  leadStage?: string | undefined;
  priority?: string | undefined;
  nextStep?: string | undefined;
  location?: string | undefined;
  loggedBy?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

enum LeadPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

enum LeadStatus {
  EVALUATING = "evaluating",
  BUILDING_PROPOSAL = "buildingProposal",
  QUALIFIED = "qualified",
  WON = "won",
  CLOSED = "closed",
  REJECTED = "rejected",
  NEGOTIATION = "negotiation",
}
