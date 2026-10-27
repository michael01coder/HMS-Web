import { http, qs } from '../lib/http';
import { Leave } from '../types';
export const LEAVE_TYPES = ['Annual', 'Sick', 'Casual', 'Unpaid'];
export const leaveService = {
  forStaff: (staffId: string) => http<Leave[]>(`/leaveapplications/staff/${staffId}`),
  pending: () => http<Leave[]>('/leaveapplications/pending'),
  balance: (staffId: string, leaveTypeName: string) => http<{ remainingDays: number; totalQuota: number }>('/leaveapplications/balance' + qs({ staffId, leaveTypeName, year: new Date().getFullYear() })).catch(() => undefined),
  apply: (p: { staffId: string; leaveTypeName: string; startDate: string; endDate: string; totalDays: number; reason: string | null }) => http('/leaveapplications', 'POST', { ...p, defaultDaysPerYear: 12 }),
  decide: (id: string, status: 'Approved' | 'Rejected', approvedByStaffId: string) => http(`/leaveapplications/${id}/status`, 'PUT', { status, approvedByStaffId }),
  days: (a: string, b: string) => (a && b ? Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5) + 1 : 0),
  /** Approved leave log for a manager's team. */
  async approvedHistory(staffIds: string[]) {
    const all = await Promise.all(staffIds.map(id => leaveService.forStaff(id).catch(() => [] as Leave[])));
    return all.flat().filter(l => l.status === 'Approved').sort((a, b) => b.startDate.localeCompare(a.startDate));
  },
};
