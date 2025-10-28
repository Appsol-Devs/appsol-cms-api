import { inject } from "inversify";
import type { IComplaintCategory } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { ComplaintCategoryRepositoryImpl } from "../../../framework/mongodb/repositories/lookups/ComplaintCategoryRepoImpl.js";

export class ComplaintCategoryInteractorImpl extends BaseLookupInteractorImpl<IComplaintCategory> {
  constructor(
    @inject(INTERFACE_TYPE.ComplaintCategoryRepositoryImpl)
    complaintCategoryRepositoryImpl: ComplaintCategoryRepositoryImpl
  ) {
    super(complaintCategoryRepositoryImpl);
  }
}
