import { injectable } from "inversify";
import type { IComplaintCategory } from "../../../../entities/index.js";
import {
  ComplaintCategoryModel,
  ComplaintCategoryModelMapper,
} from "../../models/lookups/complaintCategory.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class ComplaintCategoryRepositoryImpl extends BaseLookupRepoistoryImpl<IComplaintCategory> {
  constructor() {
    super(ComplaintCategoryModel, ComplaintCategoryModelMapper);
  }
}
