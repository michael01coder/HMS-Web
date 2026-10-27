import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { useStaffMap } from '../../hooks/useStaffMap';
import { LEAVE_TYPES, leaveService } from '../../services/leaveService';
import { fmtDate } from '../../lib/format';
import { Alert, Badge, Btn, Card, Field, Page, Table, inputCls } from '../../components/ui';

export default function LeavePage() {
  const { user, is } = useAuth(); const mgr = is('HR', 'Manager');
  const [f, setF] = useState({ leaveTypeName: 'Annual', startDate: '', endDate: '', reason: '' }); const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const staff = useStaffMap(mgr);
  const mine = useLoad(() => leaveService.forStaff(user!.staffId), []);
  const pending = useLoad(() => (mgr ? leaveService.pending() : Promise.resolve([])), [mgr]);
  const team = useLoad(async () => (mgr && !staff.loading ? leaveService.approvedHistory(staff.list.filter(s => s.staffId !== user!.staffId).map(s => s.staffId)) : []), [mgr, staff.loading, staff.list.length]);
  const bal = useLoad(() => leaveService.balance(user!.staffId, f.leaveTypeName), [f.leaveTypeName]);
  const n = leaveService.days(f.startDate, f.endDate);
  const apply = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setOk('');
    if (n < 1) return setErr('End date must be on or after the start date.');
    try { await leaveService.apply({ staffId: user!.staffId, leaveTypeName: f.leaveTypeName, startDate: f.startDate, endDate: f.endDate, totalDays: n, reason: f.reason || null }); setOk('Leave request sent.'); setF({ ...f, startDate: '', endDate: '', reason: '' }); mine.reload(); bal.reload(); } catch (x) { setErr((x as Error).message); }
  };
  const decide = async (id: string, status: 'Approved' | 'Rejected') => { try { await leaveService.decide(id, status, user!.staffId); pending.reload(); team.reload(); } catch (x) { setErr((x as Error).message); } };
  return (
    <Page title="Leave" sub="Apply for time off and track your requests.">
      <Card className="max-w-3xl p-6"><form onSubmit={apply} className="space-y-4"><Alert msg={err} /><Alert msg={ok} ok />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Leave type" required hint={bal.d ? `${bal.d.remainingDays} of ${bal.d.totalQuota} days left this year` : undefined}><select className={inputCls} value={f.leaveTypeName} onChange={e => setF({ ...f, leaveTypeName: e.target.value })}>{LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="From" required><input required type="date" className={inputCls} value={f.startDate} onChange={e => setF({ ...f, startDate: e.target.value })} /></Field>
          <Field label="To" required hint={n > 0 ? `${n} day${n > 1 ? 's' : ''}` : undefined}><input required type="date" min={f.startDate} className={inputCls} value={f.endDate} onChange={e => setF({ ...f, endDate: e.target.value })} /></Field>
        </div>
        <Field label="Reason"><textarea maxLength={500} rows={2} className={inputCls} value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} /></Field>
        <Btn type="submit">Request leave</Btn></form></Card>
      <section><h2 className="mb-3 font-semibold">My requests</h2><Table head={['Type', 'From', 'To', 'Days', 'Status']} empty={!mine.l && !mine.d?.length}>{mine.d?.map(l => <tr key={l.leaveApplicationId}><td>{l.leaveTypeName}</td><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.totalDays}</td><td><Badge text={l.status} /></td></tr>)}</Table></section>
      {mgr && <>
        <section><h2 className="mb-3 font-semibold">Awaiting approval</h2><Table head={['Staff', 'Type', 'From', 'To', 'Days', 'Reason', '']} empty={!pending.l && !pending.d?.length}>{pending.d?.map(l => <tr key={l.leaveApplicationId}><td className="font-semibold">{staff.name(l.staffId)}</td><td>{l.leaveTypeName}</td><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.totalDays}</td><td className="max-w-[200px] truncate">{l.reason || '—'}</td><td className="space-x-2 whitespace-nowrap text-right"><Btn onClick={() => decide(l.leaveApplicationId, 'Approved')}>Approve</Btn><Btn variant="ghost" onClick={() => decide(l.leaveApplicationId, 'Rejected')}>Reject</Btn></td></tr>)}</Table></section>
        <section><h2 className="mb-1 font-semibold">{is('HR') ? 'Approved leave log' : 'Team approved leave log'}</h2><p className="mb-3 text-sm text-slate-500">History of approved leave for the people you manage.</p><Alert msg={team.e} />
          <Table head={['Staff', 'Type', 'From', 'To', 'Days', 'Reason']} empty={!team.l && !team.d?.length}>{team.d?.map(l => <tr key={l.leaveApplicationId}><td className="font-semibold">{staff.name(l.staffId)}</td><td>{l.leaveTypeName}</td><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.totalDays}</td><td className="max-w-[200px] truncate">{l.reason || '—'}</td></tr>)}</Table></section>
      </>}
    </Page>
  );
}
