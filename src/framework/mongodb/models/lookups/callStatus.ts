import type { ICallStatus } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const { Model: CallStatusModel, Mapper: CallStatusModelMapper } =
  createLookupModel<ICallStatus>("CallStatus", {
    prefix: "CS",
    idFieldName: "callStatusCode",
    extraFields: {
      colorCode: { type: String },
      isFinalStatus: { type: Boolean, default: false },
    },
  });
