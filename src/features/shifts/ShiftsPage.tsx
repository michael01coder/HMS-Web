import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { useStaffMap } from '../../hooks/useStaffMap';
import { SHIFT_CATEGORIES, shiftService } from '../../services/shiftService';
import { addDays, fmtDate, hhmm, today } from '../../lib/format';
import { Role } from '../../config/roles';
import { Alert, Btn, Card, Field, Page, Table, inputCls } from '../../components/ui';

export default function ShiftsPage() {
  const { user, is } = useAuth();
  const canDefine = is(Role.HR);                       // only HR defines shift timings
  const canAllocate = is(Role.HR, Role.Manager);       // managers allocate their team, never themselves
  const [from, setFrom] = useState(today()); const [to, setTo] = useState(addDays(14)); const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const shifts = useLoad(() => shiftService.list(), []);
  const staff = useStaffMap(canAllocate);
  const sched = useLoad(() => (canAllocate ? shiftService.allocations(from, to) : shiftService.forStaff(user!.staffId, from, to)), [canAllocate, from, to]);
  const [ns, setNs] = useState({ category: SHIFT_CATEGORIES[0], startTime: '07:00', endTime: '15:00' });
  const [al, setAl] = useState({ shiftId: '', startDate: today(), endDate: today(), allocationType: 'Regular', ids: [] as string[] });
  const allocatable = staff.list.filter(s => s.isActive && (!is(Role.Manager) || s.staffId !== user!.staffId));
  const run = async (fn: () => Promise<unknown>, done: string) => { setErr(''); setOk(''); try { await fn(); setOk(done); shifts.reload(); sched.reload(); } catch (x) { setErr((x as Error).message); } };
  const mkShift = (e: FormEvent) => { e.preventDefault(); if (ns.endTime === ns.startTime) return setErr('Start and end time must differ.'); run(() => shiftService.create(ns), 'Shift created.'); };
  const allocate = (e: FormEvent) => {
    e.preventDefault();
    if (!al.ids.length) return setErr('Select at least one staff member.');
    if (al.endDate < al.startDate) return setErr('End date must be on or after the start date.');
    run(() => shiftService.allocateBulk({ staffIds: al.ids, shiftId: al.shiftId, startDate: al.startDate, endDate: al.endDate, allocationType: al.allocationType }), 'Shifts allocated.');
  };
  const toggle = (id: string) => setAl({ ...al, ids: al.ids.includes(id) ? al.ids.filter(x => x !== id) : [...al.ids, id] });
  return (
    <Page title="Shifts" sub={canAllocate ? 'Allocate shifts to your team. Only HR defines shift timings.' : 'Your upcoming schedule.'}>
      <Alert msg={err || shifts.e} /><Alert msg={ok} ok />
      {canAllocate && <div className={canDefine ? 'grid max-w-5xl grid-cols-2 gap-5' : 'max-w-2xl'}>
        {canDefine && <Card className="p-6"><h2 className="mb-4 font-semibold">New shift</h2><form onSubmit={mkShift} className="space-y-4">
          <Field label="Category" required><select className={inputCls} value={ns.category} onChange={e => setNs({ ...ns, category: e.target.value })}>{SHIFT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="Start" required><input required type="time" className={inputCls} value={ns.startTime} onChange={e => setNs({ ...ns, startTime: e.target.value })} /></Field><Field label="End" required><input required type="time" className={inputCls} value={ns.endTime} onChange={e => setNs({ ...ns, endTime: e.target.value })} /></Field></div>
          <Btn type="submit">Create shift</Btn></form></Card>}
        <Card className="p-6"><h2 className="mb-4 font-semibold">Allocate shift</h2><form onSubmit={allocate} className="space-y-4">
          <Field label="Shift" required><select required className={inputCls} value={al.shiftId} onChange={e => setAl({ ...al, shiftId: e.target.value })}><option value="">Select shift</option>{shifts.d?.filter(s => s.isActive).map(s => <option key={s.shiftId} value={s.shiftId}>{s.shiftCategory} ({hhmm(s.startTime)}–{hhmm(s.endTime)})</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="From" required><input required type="date" className={inputCls} value={al.startDate} onChange={e => setAl({ ...al, startDate: e.target.value })} /></Field><Field label="To" required><input required type="date" className={inputCls} value={al.endDate} onChange={e => setAl({ ...al, endDate: e.target.value })} /></Field></div>
          <Field label={`Staff (${al.ids.length} selected)`} required><div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">{allocatable.map(s => <label key={s.staffId} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={al.ids.includes(s.staffId)} onChange={() => toggle(s.staffId)} />{s.firstName} {s.lastName}</label>)}{!allocatable.length && <span className="text-sm text-slate-400">No staff available.</span>}</div></Field>
          <Btn type="submit">Allocate</Btn></form></Card></div>}
      <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Schedule</h2><div className="flex items-center gap-2"><input type="date" className={inputCls + ' w-40'} value={from} onChange={e => setFrom(e.target.value)} /><span className="text-slate-400">to</span><input type="date" className={inputCls + ' w-40'} value={to} onChange={e => setTo(e.target.value)} /></div></div>
        <Alert msg={sched.e} />
        <Table head={canAllocate ? ['Date', 'Staff', 'Shift', 'Time', 'Type'] : ['Date', 'Shift', 'Time', 'Type']} empty={!sched.l && !sched.d?.length}>{sched.d?.map(a => <tr key={a.allocationId}><td>{fmtDate(a.workDate)}</td>{canAllocate && <td className="font-semibold">{staff.name(a.staffId)}</td>}<td>{a.shift?.shiftCategory ?? a.shift?.shiftName ?? '—'}</td><td>{a.shift ? `${hhmm(a.shift.startTime)}–${hhmm(a.shift.endTime)}` : '—'}</td><td>{a.allocationType}</td></tr>)}</Table></section>
    </Page>
  );
}
