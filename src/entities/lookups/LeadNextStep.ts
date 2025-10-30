import { IBaseLookup } from "./BaseLookup.js";

export class ILeadNextStep extends IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly leadNextStepCode: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean
  ) {
    super(_id, name, description, isActive);
  }
}
