import { http } from '../lib/http';
import { Staff, StaffUpdate } from '../types';
export const staffService = {
  list: () => http<Staff[]>('/staffs'),
  get: (id: string) => http<Staff>(`/staffs/${id}`),
  update: (id: string, dto: StaffUpdate) => http<Staff>(`/staffs/${id}`, 'PUT', dto),
  remove: (id: string) => http(`/staffs/${id}`, 'DELETE'),
  /** Builds the full update payload from an existing record so partial edits never wipe other fields. */
  toUpdateDto: (s: Staff, o: Partial<StaffUpdate> = {}): StaffUpdate => ({
    employeeCode: s.employeeCode, firstName: s.firstName, lastName: s.lastName, phone: s.phone ?? '', departmentId: s.departmentId,
    designation: s.designation ?? '', employmentType: s.employmentType || 'Full-Time', managerId: s.managerId ?? null,
    joiningDate: s.joiningDate?.slice(0, 10), salary: s.salary, isActive: s.isActive, ...o,
  }),
  isIncomplete: (s: Staff) => !s.designation || !s.salary,
  /** Managers of one department (system role = Manager), optionally everyone in it. */
  managerCandidates: (all: Staff[], departmentId: string | number, selfId: string, currentManagerId: string, showAll: boolean) =>
    all.filter(m => m.staffId !== selfId && String(m.departmentId) === String(departmentId) && (showAll || m.role === 'Manager' || m.staffId === currentManagerId)),
};
