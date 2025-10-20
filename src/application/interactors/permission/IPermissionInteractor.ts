import { IPermission } from "../../../entities/Permission.js";

export interface IPermissionInteractor {
  uploadPermissions(): Promise<IPermission[]>;
  getAllPermissions(): Promise<IPermission[]>;
}
