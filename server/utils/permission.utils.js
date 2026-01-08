import { ROLE_PERMISSIONS } from "../constants/permissions.js";

export const resolvePermissions = (role, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];

  if (!permission || permission.length === 0) {
    return rolePermissions;
  }

  const requestedPermissions = Array.isArray(permission)
    ? permission
    : permission.split(",").map((p) => p.trim());

  return requestedPermissions.filter((p) => rolePermissions.includes(p));
};
