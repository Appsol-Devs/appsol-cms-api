import { IBaseLookup } from "./BaseLookup.js";

export class ISubscriptionType extends IBaseLookup {
  constructor(
    public readonly id: string,
    public subscriptionTypeCode: string,
    public readonly name: string,
    public readonly durationInMonths: number,
    public readonly description?: string,
    public readonly isActive?: boolean,
  ) {
    super(id, name, description, isActive);
  }
}
