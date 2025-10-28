import { SetupStatusRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/SetupStatusRepositoryImpl.js";
import { inject } from "inversify";
import type { ISetupStatus } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class SetupStatusInteractorImpl extends BaseLookupInteractorImpl<ISetupStatus> {
  constructor(
    @inject(INTERFACE_TYPE.SetupStatusRepositoryImpl)
    SetupStatusRepositoryImpl: SetupStatusRepositoryImpl
  ) {
    super(SetupStatusRepositoryImpl);
  }
}
