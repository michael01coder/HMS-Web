import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { authService } from '../../services/authService';
import { departmentService } from '../../services/departmentService';
import { Role } from '../../config/roles';
import { Alert, Btn, Card, Field, Page, inputCls } from '../../components/ui';

const blank = { firstName: '', lastName: '', email: '', phone: '', password: '', departmentId: '', role: '' };
export default function StaffCreatePage() {
  const { user, is } = useAuth();
  const owner = is(Role.HotelOwner); const allowed = owner ? [Role.HR] : [Role.Manager, Role.Staff];
  const deps = useLoad(() => departmentService.list(), []);
  const [f, setF] = useState({ ...blank, role: allowed[0] as string }); const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setOk('');
    if (f.password.length < 8) return setErr('Password must be at least 8 characters.');
    const dep = deps.d?.find(d => d.departmentId === Number(f.departmentId));
    if (!dep) return setErr('Choose a department.');
    setBusy(true);
    try {
      await authService.register({ tenantId: user!.tenantId ?? null, hotelId: user!.hotelId ?? null, firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), password: f.password, phone: f.phone.trim(), departmentId: dep.departmentId, departmentName: dep.departmentName, role: f.role });
      setOk(`Login created for ${f.firstName} ${f.lastName}. Their remaining details are completed in the Staff Directory.`); setF({ ...blank, role: allowed[0] });
    } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <Page title={owner ? 'Create HR login' : 'Create staff login'} sub="Step 1 of 2 — create credentials. Designation, salary and other HR details are completed afterwards in the Staff Directory.">
      <Card className="max-w-3xl p-6">
        <form onSubmit={submit} className="space-y-5">
          <Alert msg={err} /><Alert msg={ok} ok />
          {ok && !owner && <Link to="/staffs" className="text-sm font-semibold text-indigo-600">Go to Staff Directory</Link>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" required><input required maxLength={50} className={inputCls} value={f.firstName} onChange={set('firstName')} /></Field>
            <Field label="Last name" required><input required maxLength={50} className={inputCls} value={f.lastName} onChange={set('lastName')} /></Field>
            <Field label="Work email" required><input required type="email" className={inputCls} value={f.email} onChange={set('email')} /></Field>
            <Field label="Phone"><input maxLength={20} className={inputCls} value={f.phone} onChange={set('phone')} /></Field>
            <Field label="Department" required><select required className={inputCls} value={f.departmentId} onChange={set('departmentId')}><option value="">Select department</option>{deps.d?.filter(d => d.isActive).map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}</select></Field>
            <Field label="Role" required><select className={inputCls} value={f.role} onChange={set('role')}>{allowed.map(r => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Temporary password" required hint="At least 8 characters. Share it securely."><input required type="password" autoComplete="new-password" className={inputCls} value={f.password} onChange={set('password')} /></Field>
          </div>
          <Btn type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create login'}</Btn>
        </form>
      </Card>
    </Page>
  );
}
