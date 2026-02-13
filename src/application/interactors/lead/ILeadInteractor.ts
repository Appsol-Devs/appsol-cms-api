import type { ILead } from "../../../entities/Lead.js";
import type { IBaseInteractor } from "../base/IBaseInteractor.js";

export interface ILeadInteractor extends IBaseInteractor<ILead> {
  convertLead(id: string): Promise<ILead>;
}
