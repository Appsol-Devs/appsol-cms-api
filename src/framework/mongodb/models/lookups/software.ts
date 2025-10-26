import type { ISoftware } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: SoftwareModel, Mapper: SoftwareModelMapper } =
  createLookupModel<ISoftware>("Software", {
    prefix: "SC",
    idFieldName: "softwareCode",
  });
