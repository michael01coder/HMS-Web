import { http } from '../lib/http';
import { Designation } from '../types';
export const designationService = {
  list: () => http<Designation[]>('/designations'),
  /** Active designations that belong to the department (or to no department at all). */
  forDepartment: (all: Designation[], departmentId: string | number) =>
    all.filter(d => d.isActive && (!d.departmentId || String(d.departmentId) === String(departmentId))),
};
