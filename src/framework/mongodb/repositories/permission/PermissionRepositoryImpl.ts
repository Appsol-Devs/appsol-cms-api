import { injectable } from "inversify";
import type { IPermissionRepository } from "./IPermissionRepository.js";
import Permission, { PermissionMapper } from "../../models/permission.js";
import type { IPermission } from "../../../../entities/Permission.js";

@injectable()
export class PermissionRepositoryImpl implements IPermissionRepository {
  async add(data: IPermission): Promise<IPermission | null> {
    try {
      const newPermission = new Permission(data);
      await newPermission.save();
      if (!newPermission) return null;
      return PermissionMapper.toEntity(newPermission);
    } catch (error) {
      throw error;
    }
  }
  async findOne(
    data: Partial<IPermission>,
  ): Promise<IPermission | null | undefined> {
    try {
      const permission = await Permission.findOne({ name: data.name ?? "" });
      if (!permission) return null;
      return PermissionMapper.toEntity(permission);
    } catch (error) {
      throw error;
    }
  }
  async findAll(): Promise<IPermission[]> {
    try {
      const permissions = await Permission.find({});
      const data: IPermission[] = permissions.map((permission) =>
        PermissionMapper.toEntity(permission),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
