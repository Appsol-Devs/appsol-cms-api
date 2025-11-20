import { inject } from "inversify";
import type { IReschedule } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { RescheduleRepositoryImpl } from "../../../framework/mongodb/repositories/index.js";

export class RescheduleInteractorImpl extends BaseInteractorImpl<IReschedule> {
  constructor(
    @inject(INTERFACE_TYPE.RescheduleRepositoryImpl)
    rescheduleRepositoryImpl: RescheduleRepositoryImpl
  ) {
    super(rescheduleRepositoryImpl);
  }
}
