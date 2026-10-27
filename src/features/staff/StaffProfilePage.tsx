import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLoad } from '../../hooks/useLoad';
import { staffService } from '../../services/staffService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { addDays, fmtDate, fmtTime, hours, today } from '../../lib/format';
import { cx } from '../../lib/cx';
import { Alert, Badge, Card, Page, Table, inputCls } from '../../components/ui';

/** Per-staff log: profile summary, attendance history and leave history. */
export default function StaffProfilePage() {
  const { id = '' } = useParams();
  const [tab, setTab] = useState<'attendance' | 'leave'>('attendance'); const [from, setFrom] = useState(addDays(-90)); const [to, setTo] = useState(today());
  const staff = useLoad(() => staffService.get(id), [id]);
  const att = useLoad(() => attendanceService.history(id, from, to), [id, from, to]);
  const leave = useLoad(() => leaveService.forStaff(id), [id]);
  const s = staff.d;
  const totalHours = (att.d ?? []).reduce((n, a) => n + (a.totalHours ?? 0), 0);
  const leaveDays = (leave.d ?? []).filter(l => l.status === 'Approved').reduce((n, l) => n + l.totalDays, 0);
  const info: [string, string][] = s ? [['Employee code', s.employeeCode], ['Department', s.departmentName ?? '—'], ['Designation', s.designation || '—'], ['Role', s.role], ['Reports to', s.managerName || '—'], ['Joined', staffService.isIncomplete(s) ? '—' : fmtDate(s.joiningDate)]] : [];
  return (
    <Page title={s ? `${s.firstName} ${s.lastName}` : 'Staff profile'} sub={s?.email} actions={<Link to="/staffs" className="flex items-center gap-1 text-sm font-semibold text-indigo-600"><ArrowLeft size={16} />Back to directory</Link>}>
      <Alert msg={staff.e} />
      {s && <Card className="grid grid-cols-3 gap-5 p-6">{info.map(([k, v]) => <div key={k}><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-medium">{v}</div></div>)}</Card>}
      <div className="grid max-w-2xl grid-cols-3 gap-5">
        {[['Days attended', String(att.d?.length ?? 0)], ['Hours worked', hours(totalHours)], ['Approved leave days', String(leaveDays)]].map(([k, v]) => <Card key={k} className="p-5"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</div><div className="mt-3 text-3xl font-bold">{v}</div></Card>)}
      </div>
      <div className="flex gap-2">{(['attendance', 'leave'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={cx('rounded-lg px-4 py-2 text-sm font-semibold capitalize', tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200')}>{t} history</button>)}</div>
      {tab === 'attendance' && <section className="space-y-3">
        <div className="flex items-center gap-2"><input type="date" className={inputCls + ' w-40'} value={from} onChange={e => setFrom(e.target.value)} /><span className="text-slate-400">to</span><input type="date" className={inputCls + ' w-40'} value={to} onChange={e => setTo(e.target.value)} /></div>
        <Alert msg={att.e} />
        <Table head={['Date', 'In', 'Out', 'Hours', 'Overtime', 'Status']} empty={!att.l && !att.d?.length}>{att.d?.map(a => <tr key={a.attendanceId}><td>{fmtDate(a.attendanceDate)}</td><td>{fmtTime(a.clockInTime)}</td><td>{fmtTime(a.clockOutTime)}</td><td>{hours(a.totalHours)}</td><td>{hours(a.overtimeHours)}</td><td><Badge text={a.status} /></td></tr>)}</Table></section>}
      {tab === 'leave' && <section className="space-y-3"><Alert msg={leave.e} />
        <Table head={['Type', 'From', 'To', 'Days', 'Reason', 'Status']} empty={!leave.l && !leave.d?.length}>{leave.d?.map(l => <tr key={l.leaveApplicationId}><td>{l.leaveTypeName}</td><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.totalDays}</td><td className="max-w-[220px] truncate">{l.reason || '—'}</td><td><Badge text={l.status} /></td></tr>)}</Table></section>}
    </Page>
  );
}
