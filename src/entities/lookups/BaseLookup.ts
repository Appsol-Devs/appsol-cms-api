export class IBaseLookup {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive?: boolean,
    public readonly colorCode?: string
  ) {}
}
