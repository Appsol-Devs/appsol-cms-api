import { inject, injectable } from "inversify";
import type { ComplaintCategoryInteractorImpl } from "../../../application/interactors/index.js";
import type { IComplaintCategory } from "../../../entities/lookups/ComplaintCategory.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class ComplaintCategoryController extends BaseLookupController<IComplaintCategory> {
  constructor(
    @inject(INTERFACE_TYPE.ComplaintCategoryInteractorImpl)
    complaintCategoryInteractor: ComplaintCategoryInteractorImpl
  ) {
    super(complaintCategoryInteractor);
  }
}
