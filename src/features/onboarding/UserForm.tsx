import { FormEvent, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';
import { Alert, Btn, Field, inputCls } from '../../components/ui';

const blank = { firstName: '', lastName: '', email: '', phone: '', password: '' };
/** Registers one login (TenantAdmin, HotelOwner…) through the auth service. */
export default function UserForm({ role, tenantId, hotelId, submitLabel, onDone }: { role: string; tenantId?: string | null; hotelId?: string | null; submitLabel: string; onDone: (email: string) => void }) {
  const [f, setF] = useState(blank); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr('');
    if (f.password.length < 8) return setErr('Password must be at least 8 characters.');
    setBusy(true);
    try { await authService.register({ tenantId: tenantId ?? null, hotelId: hotelId ?? null, firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), password: f.password, phone: f.phone.trim(), role }); onDone(f.email.trim()); setF(blank); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4"><Alert msg={err} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required><input required maxLength={50} className={inputCls} value={f.firstName} onChange={set('firstName')} /></Field>
        <Field label="Last name" required><input required maxLength={50} className={inputCls} value={f.lastName} onChange={set('lastName')} /></Field>
        <Field label="Email" required><input required type="email" className={inputCls} value={f.email} onChange={set('email')} /></Field>
        <Field label="Phone"><input maxLength={20} className={inputCls} value={f.phone} onChange={set('phone')} /></Field>
        <Field label="Temporary password" required hint="At least 8 characters."><input required type="password" autoComplete="new-password" className={inputCls} value={f.password} onChange={set('password')} /></Field>
      </div>
      <Btn type="submit" disabled={busy}><UserPlus size={16} />{busy ? 'Creating…' : submitLabel}</Btn>
    </form>
  );
}
