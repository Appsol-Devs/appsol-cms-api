import { inject, injectable } from "inversify";
import { IPermission } from "../../../entities/index.js";
import type { IPermissionInteractor } from "./IPermissionInteractor.js";
import type { ILogger } from "../../../framework/index.js";
import {
  PermissionMapper,
  type IPermissionRepository,
} from "../../../framework/mongodb/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { UserPermissions } from "../../../utils/constants/index.js";

@injectable()
export class PermissionInteractorImpl implements IPermissionInteractor {
  private permissionRepository: IPermissionRepository;
  private logger: ILogger;
  constructor(
    @inject(INTERFACE_TYPE.PermissionRepositoryImpl)
    permissionRepository: IPermissionRepository,
    @inject(INTERFACE_TYPE.Logger) logger: ILogger
  ) {
    this.permissionRepository = permissionRepository;
    this.logger = logger;
  }
  async uploadPermissions(): Promise<IPermission[]> {
    const permissions = Object.values(UserPermissions).map(async (name) => {
      let permission = await this.permissionRepository.findOne(name);
      if (!permission) {
        permission = await this.permissionRepository.add({ name: name });
        this.logger.info(`Added permission: ${name} ⭐`);
      } else {
        this.logger.info(`Permission ${name} already exists`);
      }
      return permission;
    });
    this.logger.info("Permissions uploaded");
    return permissions.map((permission) =>
      PermissionMapper.toEntity(permission)
    );
  }
  async getAllPermissions(): Promise<IPermission[]> {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((permission) =>
      PermissionMapper.toEntity(permission)
    );
  }
}
