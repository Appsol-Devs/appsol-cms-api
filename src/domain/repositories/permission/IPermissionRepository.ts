import type { IPermission } from "../../../entities/index.js";

export interface IPermissionRepository {
  add(data: IPermission): Promise<IPermission | null>;
  findOne(name: string): Promise<IPermission | null>;
  findAll(): Promise<IPermission[]>;
}
