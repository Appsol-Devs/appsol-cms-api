import type { IComplaintCategory } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const {
  Model: ComplaintCategoryModel,
  Mapper: ComplaintCategoryModelMapper,
} = createLookupModel<IComplaintCategory>("ComplaintCategory", {
  prefix: "CC",
  idFieldName: "complaintCategoryCode",
});
