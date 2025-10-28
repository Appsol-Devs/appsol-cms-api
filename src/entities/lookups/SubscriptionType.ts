import { IBaseLookup } from "./BaseLookup.js";

export class ISubscriptionType extends IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly subscriptionTypeCode: string,
    public readonly name: string,
    public readonly durationInMonths: number,
    public readonly description?: string,
    public readonly isActive?: boolean
  ) {
    super(_id, name, description, isActive);
  }
}
