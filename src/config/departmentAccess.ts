import { Role } from './roles';
/** Feature modules a department can unlock. Edit RULES to match your department names. */
export type Module = 'frontdesk' | 'housekeeping' | 'maintenance';
export const ALL_MODULES: Module[] = ['frontdesk', 'housekeeping', 'maintenance'];
const RULES: [RegExp, Module[]][] = [
  [/front|reception|guest|concierge/i, ['frontdesk']],
  [/house|laundry|cleaning|room/i, ['housekeeping']],
  [/maint|engineer|technic|facilit/i, ['maintenance']],
];
/** HR, owners and admins see every module. Managers and staff only see their department's modules. */
export function modulesFor(role: string, departmentName?: string): Module[] {
  if (role !== Role.Manager && role !== Role.Staff) return ALL_MODULES;
  return RULES.filter(([re]) => re.test(departmentName ?? '')).flatMap(([, m]) => m);
}
