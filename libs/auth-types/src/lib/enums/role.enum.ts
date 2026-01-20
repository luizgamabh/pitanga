/**
 * User roles for access control.
 * Maps to Prisma UserRole enum.
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN', // System administrator (Pitanga staff)
  ADMIN = 'ADMIN',             // Tenant administrator
  MANAGER = 'MANAGER',         // Can manage content and points
  OPERATOR = 'OPERATOR',       // Can only view
}

/**
 * Alias for backward compatibility
 * @deprecated Use Role instead
 */
export const UserRole = Role;
