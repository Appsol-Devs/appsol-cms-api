import { SoftwareRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/SoftwareRepositoryImpl.js";
import { inject } from "inversify";
import type { ISoftware } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class SoftwareInteractorImpl extends BaseLookupInteractorImpl<ISoftware> {
  constructor(
    @inject(INTERFACE_TYPE.SoftwareRepositoryImpl)
    softwareRepositoryImpl: SoftwareRepositoryImpl
  ) {
    super(softwareRepositoryImpl);
  }
}
