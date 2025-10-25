import { inject, injectable } from "inversify";
import { IPermission } from "../../../entities/index.js";
import type { IPermissionInteractor } from "./IPermissionInteractor.js";
import type { ILogger } from "../../../framework/index.js";
import {
  PermissionMapper,
  type IPermissionRepository,
  type IRoleRepository,
} from "../../../framework/mongodb/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { UserPermissions } from "../../../utils/constants/index.js";

@injectable()
export class PermissionInteractorImpl implements IPermissionInteractor {
  private permissionRepository: IPermissionRepository;
  private logger: ILogger;
  private roleRepository: IRoleRepository;
  constructor(
    @inject(INTERFACE_TYPE.PermissionRepositoryImpl)
    permissionRepository: IPermissionRepository,
    @inject(INTERFACE_TYPE.Logger) logger: ILogger,
    @inject(INTERFACE_TYPE.RoleRepositoryImpl) roleRepository: IRoleRepository
  ) {
    this.permissionRepository = permissionRepository;
    this.logger = logger;
    this.roleRepository = roleRepository;
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
    await this.ensureAdminRole(await Promise.all(permissions));
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

  private async ensureAdminRole(permissions: any[]): Promise<void> {
    try {
      let adminRole = await this.roleRepository.findByName("Administrator");
      const permissionNames = permissions.map((p) => p.name);

      if (!adminRole) {
        adminRole = await this.roleRepository.addRole({
          name: "Administrator",
          description: "System administrator role with all permissions",
          companyId: undefined,
          permissions: permissionNames,
        });
        this.logger.info("Created default Administrator role 🧑‍💼");
      } else {
        await this.roleRepository.updateRole(adminRole._id!, {
          permissions: permissionNames,
        });
        this.logger.info("Updated Administrator role with new permissions 🔄");
      }
    } catch (error) {
      this.logger.error("Failed to ensure Administrator role:", error);
      throw error;
    }
  }
}
