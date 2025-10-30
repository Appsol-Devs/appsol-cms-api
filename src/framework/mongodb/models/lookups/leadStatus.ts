import type { ILeadStatus } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: LeadStatusModel, Mapper: LeadStatusModelMapper } =
  createLookupModel<ILeadStatus>("LeadStatus", {
    prefix: "LS",
    idFieldName: "leadStatusCode",
  });
