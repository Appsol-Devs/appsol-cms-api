import { IBaseLookup } from "./BaseLookup.js";

export class IOutreachType extends IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly outreachTypeCode: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean,
    public readonly colorCode?: string
  ) {
    super(_id, name, description, isActive, colorCode);
  }
}
