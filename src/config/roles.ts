export const Role = { SuperAdmin: 'SuperAdmin', TenantAdmin: 'TenantAdmin', HotelOwner: 'HotelOwner', HR: 'HR', Manager: 'Manager', Staff: 'Staff' } as const;
export const ADMINS: string[] = [Role.SuperAdmin, Role.TenantAdmin];
export const OWNERS: string[] = [...ADMINS, Role.HotelOwner];
/** Roles that have a row in the Staff table. */
export const STAFF_ROLES: string[] = [Role.HR, Role.Manager, Role.Staff];
export const HR_ONLY: string[] = [Role.HR];
export const HR_OWNER: string[] = [Role.HR, Role.HotelOwner];
export const HR_MANAGER: string[] = [Role.HR, Role.Manager];
export const PROPERTY_ROLES: string[] = [...OWNERS, Role.HR, Role.Manager, Role.Staff];
