import type { IOutreachType } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: OutreachTypeModel, Mapper: OutreachTypeModelMapper } =
  createLookupModel<IOutreachType>("OutreachType", {
    prefix: "SC",
    idFieldName: "outreachTypeCode",
  });
