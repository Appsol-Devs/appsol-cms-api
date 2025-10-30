import type { ILeadNextStep } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: LeadNextStepModel, Mapper: LeadNextStepModelMapper } =
  createLookupModel<ILeadNextStep>("LeadNextStep", {
    prefix: "LNS",
    idFieldName: "leadNextStepCode",
  });
