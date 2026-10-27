import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { useStaffMap } from '../../hooks/useStaffMap';
import { shiftService } from '../../services/shiftService';
import { swapService } from '../../services/swapService';
import { addDays, fmtDate, hhmm, today } from '../../lib/format';
import { Allocation, Staff, Swap } from '../../types';
import { Alert, Badge, Btn, Card, Field, Modal, Page, Table, inputCls } from '../../components/ui';

const label = (a?: Allocation) => (a ? `${fmtDate(a.workDate)} · ${a.shift?.shiftCategory ?? 'Shift'}${a.shift ? ` ${hhmm(a.shift.startTime)}–${hhmm(a.shift.endTime)}` : ''}` : '—');

export default function SwapsPage() {
  const { user, is } = useAuth(); const mgr = is('HR', 'Manager');
  const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const staff = useStaffMap(mgr);
  const mine = useLoad(() => swapService.forStaff(user!.staffId), []);
  const myAlloc = useLoad(() => shiftService.forStaff(user!.staffId, today(), addDays(30)), []);
  const pending = useLoad(() => (mgr ? swapService.pending() : Promise.resolve([] as Swap[])), [mgr]);
  const [f, setF] = useState({ allocationId: '', reason: '' }); const [assign, setAssign] = useState<Swap | null>(null);
  const request = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setOk('');
    try { await swapService.request(user!.staffId, f.allocationId, f.reason); setOk('Swap requested. HR or your manager will arrange it.'); setF({ allocationId: '', reason: '' }); mine.reload(); } catch (x) { setErr((x as Error).message); }
  };
  const reject = async (s: Swap) => { try { await swapService.reject(s.swapRequestId, user!.staffId); pending.reload(); } catch (x) { setErr((x as Error).message); } };
  const partner = (s: Swap) => (swapService.isAssigned(s) ? (mgr ? staff.name(s.targetStaffId) : 'Assigned') : 'Not assigned yet');
  return (
    <Page title="Shift swaps" sub={is('Staff') ? 'Ask to change one of your shifts. You don’t pick who covers it — HR or your manager does.' : 'Request a change for yourself, or review requests and assign who swaps.'}>
      <Alert msg={err} /><Alert msg={ok} ok />
      <Card className="max-w-3xl p-6"><form onSubmit={request} className="space-y-4">
        <Field label="Shift to change" required><select required className={inputCls} value={f.allocationId} onChange={e => setF({ ...f, allocationId: e.target.value })}><option value="">Select one of your upcoming shifts</option>{myAlloc.d?.map(a => <option key={a.allocationId} value={a.allocationId}>{label(a)}</option>)}</select></Field>
        <Field label="Reason" required><textarea required maxLength={255} rows={2} className={inputCls} value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} /></Field>
        <Btn type="submit">Request swap</Btn></form></Card>
      <section><h2 className="mb-3 font-semibold">My requests</h2><Table head={['Shift', 'Reason', 'Requested', 'Swap with', 'Status']} empty={!mine.l && !mine.d?.length}>{mine.d?.map(s => <tr key={s.swapRequestId}><td>{label(s.requesterAllocation)}</td><td>{s.reason || '—'}</td><td>{fmtDate(s.requestedAt)}</td><td>{partner(s)}</td><td><Badge text={s.status} /></td></tr>)}</Table></section>
      {mgr && <section><h2 className="mb-3 font-semibold">Awaiting assignment</h2><Table head={['Staff', 'Shift', 'Reason', '']} empty={!pending.l && !pending.d?.length}>{pending.d?.map(s => <tr key={s.swapRequestId}><td className="font-semibold">{staff.name(s.requesterStaffId)}</td><td>{label(s.requesterAllocation)}</td><td className="max-w-[220px] truncate">{s.reason || '—'}</td><td className="space-x-2 whitespace-nowrap text-right"><Btn onClick={() => setAssign(s)}>Assign swap</Btn><Btn variant="ghost" onClick={() => reject(s)}>Reject</Btn></td></tr>)}</Table></section>}
      {assign && <AssignModal swap={assign} staff={staff.list.filter(s => s.isActive && s.staffId !== assign.requesterStaffId)} requester={staff.name(assign.requesterStaffId)} approver={user!.staffId} onClose={() => setAssign(null)} onDone={() => { setAssign(null); pending.reload(); }} />}
    </Page>
  );
}

function AssignModal({ swap, staff, requester, approver, onClose, onDone }: { swap: Swap; staff: Staff[]; requester: string; approver: string; onClose: () => void; onDone: () => void }) {
  const [target, setTarget] = useState(''); const [alloc, setAlloc] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const list = useLoad(() => (target ? shiftService.forStaff(target, today(), addDays(30)) : Promise.resolve([] as Allocation[])), [target]);
  const go = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await swapService.approve(swap.swapRequestId, approver, target, alloc || null); onDone(); } catch (x) { setErr((x as Error).message); setBusy(false); }
  };
  return (
    <Modal title="Assign swap" onClose={onClose}><form onSubmit={go} className="space-y-4"><Alert msg={err} />
      <p className="text-sm text-slate-600"><b>{requester}</b> wants to hand over: <b>{label(swap.requesterAllocation)}</b></p>
      <Field label="Swap with" required><select required className={inputCls} value={target} onChange={e => { setTarget(e.target.value); setAlloc(''); }}><option value="">Select staff member</option>{staff.map(s => <option key={s.staffId} value={s.staffId}>{s.firstName} {s.lastName}{s.departmentName ? ` — ${s.departmentName}` : ''}</option>)}</select></Field>
      {target && <Field label="Their shift in return" hint="Leave empty if they simply cover this shift."><select className={inputCls} value={alloc} onChange={e => setAlloc(e.target.value)}><option value="">No shift in return</option>{list.d?.map(a => <option key={a.allocationId} value={a.allocationId}>{label(a)}</option>)}</select></Field>}
      <div className="flex justify-end gap-3"><Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn><Btn type="submit" disabled={busy || !target}>{busy ? 'Approving…' : 'Approve swap'}</Btn></div></form></Modal>
  );
}
