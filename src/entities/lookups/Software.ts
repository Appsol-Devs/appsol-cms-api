import { IBaseLookup } from "./BaseLookup.js";

export class ISoftware extends IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly softwareCode: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean
  ) {
    super(_id, name, description, isActive);
  }
}
