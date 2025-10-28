import type { ISetupStatus } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: SetupStatusModel, Mapper: SetupStatusModelMapper } =
  createLookupModel<ISetupStatus>("SetupStatus", {
    prefix: "SS",
    idFieldName: "setupStatusCode",
  });
