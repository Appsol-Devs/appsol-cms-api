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
  VIEW_SETTINGS: "view:settings",
  UPDATE_SETTINGS: "update:settings",
  VIEW_COMPLAINT_TYPES: "view:complaint_types",
  VIEW_COMPLAINT_TYPE: "view:complaint_type",
  CREATE_COMPLAINT_TYPE: "create:complaint_type",
  UPDATE_COMPLAINT_TYPE: "update:complaint_type",
  DELETE_COMPLAINT_TYPE: "delete:complaint_type",
} as const);

export default Permissions;
const UserPermissions = Object.values(Permissions);

export type PermissionType = typeof Permissions;

export { Permissions, UserPermissions };
