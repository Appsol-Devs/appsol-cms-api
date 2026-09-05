import { inject } from "inversify";
import type { ICallStatus } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { IBaseLookupRepository } from "../../../domain/repositories/base/IBaseLookupRepository.js";

export class CallStatusInteractorImpl extends BaseLookupInteractorImpl<ICallStatus> {
  constructor(
    @inject(INTERFACE_TYPE.CallStatusRepositoryImpl)
    callStatusRepository: IBaseLookupRepository<ICallStatus>,
  ) {
    super(callStatusRepository as any);
  }
}
