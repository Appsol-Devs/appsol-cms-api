import { IBaseLookup } from "./BaseLookup.js";

export class IComplaintType extends IBaseLookup {
  constructor(
    public complaintTypeCode: string,
    public readonly _id?: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly colorCode?: string,
    public readonly isActive?: boolean,
  ) {
    super(_id, name, description, isActive);
  }
}
