import { OutreachTypeRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/OutreachTypeRepositoryImpl.js";
import { inject } from "inversify";
import type { IOutreachType } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class OutreachTypeInteractorImpl extends BaseLookupInteractorImpl<IOutreachType> {
  constructor(
    @inject(INTERFACE_TYPE.OutreachTypeRepositoryImpl)
    OutreachTypeRepositoryImpl: OutreachTypeRepositoryImpl
  ) {
    super(OutreachTypeRepositoryImpl);
  }
}
