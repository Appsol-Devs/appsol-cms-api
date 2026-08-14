import { inject } from "inversify";
import type { IComplaintCategory } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { IBaseLookupRepository } from "../../../domain/repositories/base/IBaseLookupRepository.js";

export class ComplaintCategoryInteractorImpl extends BaseLookupInteractorImpl<IComplaintCategory> {
  constructor(
    @inject(INTERFACE_TYPE.ComplaintCategoryRepositoryImpl)
    complaintCategoryRepository: IBaseLookupRepository<IComplaintCategory>,
  ) {
    super(complaintCategoryRepository as any);
  }
}
