import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { staffService } from '../../services/staffService';
import { fmtDate } from '../../lib/format';
import { Role } from '../../config/roles';
import { Staff } from '../../types';
import { Alert, Btn, Card, Field, Page, inputCls } from '../../components/ui';
import DesignationField from './DesignationField';

function Form({ p, onSaved }: { p: Staff; onSaved: () => Promise<void> }) {
  const [f, setF] = useState({ firstName: p.firstName, lastName: p.lastName, phone: p.phone ?? '', designation: p.designation ?? '', employmentType: p.employmentType || 'Full-Time' });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setOk(''); setBusy(true);
    try { await staffService.update(p.staffId, staffService.toUpdateDto(p, { firstName: f.firstName.trim(), lastName: f.lastName.trim(), phone: f.phone, designation: f.designation, employmentType: f.employmentType })); await onSaved(); setOk('Your details were updated.'); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4"><Alert msg={err} /><Alert msg={ok} ok />
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required><input required maxLength={50} className={inputCls} value={f.firstName} onChange={e => setF({ ...f, firstName: e.target.value })} /></Field>
        <Field label="Last name" required><input required maxLength={50} className={inputCls} value={f.lastName} onChange={e => setF({ ...f, lastName: e.target.value })} /></Field>
        <Field label="Phone"><input className={inputCls} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
        <DesignationField value={f.designation} onChange={v => setF({ ...f, designation: v })} departmentId={p.departmentId} />
        <Field label="Employment type"><select className={inputCls} value={f.employmentType} onChange={e => setF({ ...f, employmentType: e.target.value })}><option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Intern</option></select></Field>
      </div>
      <Btn type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Btn>
    </form>
  );
}
export default function MyProfilePage() {
  const { profile, refreshProfile, is } = useAuth(); const editable = is(Role.HR);
  const info: [string, string][] = profile ? [['Employee code', profile.employeeCode], ['Email', profile.email], ['Department', profile.departmentName ?? '—'], ['Role', profile.role], ['Reports to', profile.managerName || '—'], ['Joined', fmtDate(profile.joiningDate)]] : [];
  return (
    <Page title="My profile" sub={editable ? 'You can update your own details. Salary, department and manager are managed by the hotel owner.' : 'Your details. Ask HR to change anything here.'}>
      {!profile && <Alert msg="Your staff profile could not be loaded." />}
      {profile && <>
        <Card className="grid max-w-4xl grid-cols-3 gap-5 p-6">{info.map(([k, v]) => <div key={k}><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-medium">{v}</div></div>)}</Card>
        {editable ? <Card className="max-w-4xl p-6"><Form p={profile} onSaved={refreshProfile} /></Card>
          : <Card className="grid max-w-4xl grid-cols-3 gap-5 p-6">{[['Name', `${profile.firstName} ${profile.lastName}`], ['Phone', profile.phone || '—'], ['Designation', profile.designation || '—']].map(([k, v]) => <div key={k}><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-medium">{v}</div></div>)}</Card>}
      </>}
    </Page>
  );
}
