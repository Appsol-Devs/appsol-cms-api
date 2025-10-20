const Permissions = Object.freeze({
  CREATE_ROLE: "create:role",
  VIEW_ROLE: "view:role",
  UPDATE_ROLE: "update:role",
  DELETE_ROLE: "delete:role",
  VIEW_ROLES: "view:roles",
  CREATE_PERMISSION: "create:permission",
  VIEW_PERMISSION: "view:permission",
  VIEW_PERMISSIONS: "view:permissions",
  UPDATE_PERMISSION: "update:permission",
  DELETE_PERMISSION: "delete:permission",
  CREATE_USER: "create:user",
  VIEW_USER: "view:user",
  UPDATE_USER: "update:user",
  DELETE_USER: "delete:user",
  VIEW_USERS: "view:users",
} as const);

export default Permissions;
const UserPermissions = Object.values(Permissions);

export type PermissionType = typeof Permissions;

export { Permissions, UserPermissions };
