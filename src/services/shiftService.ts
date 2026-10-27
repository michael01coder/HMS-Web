import { http, qs } from '../lib/http';
import { Allocation, Shift } from '../types';
export const SHIFT_CATEGORIES = ['Morning', 'Afternoon', 'Night', 'Split'];
export const shiftService = {
  list: () => http<Shift[]>('/shifts'),
  /** The shift name is the category, so no separate name is asked for. */
  create: (p: { category: string; startTime: string; endTime: string }) => http('/shifts', 'POST', { shiftName: p.category, shiftCategory: p.category, startTime: p.startTime + ':00', endTime: p.endTime + ':00' }),
  allocations: (startDate: string, endDate: string) => http<Allocation[]>('/shifts/allocations' + qs({ startDate, endDate })),
  forStaff: (staffId: string, startDate: string, endDate: string) => http<Allocation[]>(`/shifts/allocations/staff/${staffId}` + qs({ startDate, endDate })),
  allocateBulk: (p: { staffIds: string[]; shiftId: string; startDate: string; endDate: string; allocationType: string }) => http('/shifts/allocations/bulk', 'POST', p),
};
