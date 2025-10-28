import { IBaseLookup } from "./BaseLookup.js";

export class ICallStatus extends IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly callStatusCode: string,
    public readonly isFinalStatus: boolean,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean,
    public readonly colorCode?: string
  ) {
    super(_id, name, description, isActive);
  }
}
