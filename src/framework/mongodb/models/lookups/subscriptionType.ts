import type { ISubscriptionType } from "../../../../entities/index.js";
import { createLookupModel } from "../../utils/lookupFactory.js";

export const {
  Model: SubscriptionTypeModel,
  Mapper: SubscriptionTypeModelMapper,
} = createLookupModel<ISubscriptionType>("SubscriptionType", {
  prefix: "ST",
  idFieldName: "subscriptionTypeCode",
  extraFields: {
    durationInMonths: { type: Number, required: true },
  },
});
