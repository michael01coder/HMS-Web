import { http } from '../lib/http';
import { EMPTY_GUID } from '../config/constants';
import { Swap } from '../types';
export const swapService = {
  forStaff: (staffId: string) => http<Swap[]>(`/shifts/swaps/staff/${staffId}`),
  pending: () => http<Swap[]>('/shifts/swaps/pending'),
  /** Staff only ask for a change; HR or a manager picks the partner later. */
  request: (staffId: string, allocationId: string, reason: string) => http('/shifts/swaps', 'POST', { requesterStaffId: staffId, requesterAllocationId: allocationId, targetStaffId: EMPTY_GUID, targetAllocationId: null, reason: reason || null }),
  reject: (id: string, approverId: string) => http(`/shifts/swaps/${id}/status`, 'PUT', { status: 'Rejected', approvedByStaffId: approverId }),
  approve: (id: string, approverId: string, targetStaffId: string, targetAllocationId: string | null) => http(`/shifts/swaps/${id}/status`, 'PUT', { status: 'Approved', approvedByStaffId: approverId, targetStaffId, targetAllocationId }),
  isAssigned: (s: Swap) => !!s.targetStaffId && s.targetStaffId !== EMPTY_GUID,
};
