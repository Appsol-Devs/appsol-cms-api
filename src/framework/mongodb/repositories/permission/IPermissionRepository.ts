import type { IPermission } from "../../../../entities/Permission.js";

export interface IPermissionRepository {
  add(data: IPermission): Promise<IPermission | null>;
  findOne(data: Partial<IPermission>): Promise<IPermission | null | undefined>;
  findAll(): Promise<IPermission[]>;
}
