export class IComplaintType {
  constructor(
    public readonly _id: string,
    public readonly complaintTypeCode: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean
  ) {}
}
