// Role-based route guards and utilities

export type UserRole = 'SUPER_ADMIN' | 'WORKSHOP_ADMIN' | 'MASTER' | 'DRIVER' | 'STORE_OWNER';

export const ROLE_ROUTES: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['/dashboard/admin', '/dashboard/admin/workshops', '/dashboard/admin/analytics'],
  WORKSHOP_ADMIN: ['/dashboard/workshop', '/dashboard/workshop/board', '/dashboard/workshop/queue', '/dashboard/workshop/masters'],
  MASTER: ['/dashboard/master', '/dashboard/master/vehicles', '/dashboard/master/services'],
  DRIVER: ['/dashboard/driver', '/dashboard/driver/garage', '/dashboard/driver/appointments', '/dashboard/driver/history'],
  STORE_OWNER: ['/dashboard/shop', '/dashboard/shop/inventory', '/dashboard/shop/catalog'],
};

export const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export function isRouteAllowedForRole(route: string, role: UserRole): boolean {
  const allowedRoutes = ROLE_ROUTES[role] || [];
  return allowedRoutes.some((allowed) => route.startsWith(allowed));
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    WORKSHOP_ADMIN: 'Workshop Manager',
    MASTER: 'Service Master',
    DRIVER: 'Driver',
    STORE_OWNER: 'Shop Owner',
  };
  return labels[role] || role;
}
