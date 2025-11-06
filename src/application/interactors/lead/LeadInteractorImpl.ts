import { inject } from "inversify";
import type { ILead } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { LeadRepositoryImpl } from "../../../framework/mongodb/repositories/lead/index.js";

export class LeadInteractorImpl extends BaseInteractorImpl<ILead> {
  constructor(
    @inject(INTERFACE_TYPE.LeadRepositoryImpl)
    leadRepositoryImpl: LeadRepositoryImpl
  ) {
    super(leadRepositoryImpl);
  }

  async update(id: string, data: ILead): Promise<ILead> {
    // TODO: implement add customer when lead stutus is WON
    return super.update(id, data);
  }
}
