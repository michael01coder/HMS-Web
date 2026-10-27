import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { useStaffMap } from '../../hooks/useStaffMap';
import { attendanceService } from '../../services/attendanceService';
import { fmtDate, fmtTime, hours, monthStart, today } from '../../lib/format';
import { Alert, Badge, Page, Table, inputCls } from '../../components/ui';
import QuickClock from './QuickClock';

export default function AttendancePage() {
  const { user, is } = useAuth(); const mgr = is('HR', 'Manager');
  const [date, setDate] = useState(today());
  const mine = useLoad(() => attendanceService.history(user!.staffId, monthStart(), today()), []);
  const staff = useStaffMap(mgr);
  const daily = useLoad(() => (mgr ? attendanceService.daily(date) : Promise.resolve([])), [mgr, date]);
  return (
    <Page title="Attendance" sub="Clock in when your shift starts and clock out when it ends.">
      <QuickClock onChange={mine.reload} />
      <Alert msg={mine.e} />
      <section><h2 className="mb-3 font-semibold">My attendance this month</h2>
        <Table head={['Date', 'In', 'Out', 'Hours', 'Overtime', 'Status']} empty={!mine.l && !mine.d?.length}>{mine.d?.map(a => <tr key={a.attendanceId}><td>{fmtDate(a.attendanceDate)}</td><td>{fmtTime(a.clockInTime)}</td><td>{fmtTime(a.clockOutTime)}</td><td>{hours(a.totalHours)}</td><td>{hours(a.overtimeHours)}</td><td><Badge text={a.status} /></td></tr>)}</Table></section>
      {mgr && <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{is('HR') ? 'Hotel attendance' : 'Team attendance'}</h2><input type="date" className={inputCls + ' w-44'} value={date} onChange={e => setDate(e.target.value)} /></div>
        <Alert msg={daily.e} />
        <Table head={['Staff', 'In', 'Out', 'Hours', 'Status']} empty={!daily.l && !daily.d?.length}>{daily.d?.map(a => <tr key={a.attendanceId}><td className="font-semibold">{staff.name(a.staffId)}</td><td>{fmtTime(a.clockInTime)}</td><td>{fmtTime(a.clockOutTime)}</td><td>{hours(a.totalHours)}</td><td><Badge text={a.status} /></td></tr>)}</Table></section>}
    </Page>
  );
}
