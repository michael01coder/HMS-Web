import { http, qs } from '../lib/http';
import { Attendance } from '../types';
export const attendanceService = {
  history: (staffId: string, startDate: string, endDate: string) => http<Attendance[]>(`/attendances/staff/${staffId}` + qs({ startDate, endDate })),
  daily: (date: string) => http<Attendance[]>('/attendances/daily' + qs({ date })),
  clockIn: (staffId: string) => http('/attendances/clock-in', 'POST', { staffId }),
  clockOut: (staffId: string) => http('/attendances/clock-out', 'POST', { staffId }),
  /** The record still open today (clocked in, not out), if any. */
  openRecord: (rows: Attendance[]) => rows.find(a => a.clockInTime && !a.clockOutTime),
};
