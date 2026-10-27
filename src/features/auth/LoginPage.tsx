import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, ShieldCheck, Building2, Users, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Alert, Btn, Field, inputCls } from '../../components/ui';

export default function Login() {
  const { user, login } = useAuth(); const nav = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setErr(''); try { await login(email.trim(), password); nav('/'); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); } };
  const pts = [[ShieldCheck, 'Platform Admin — tenants, plans, roles'], [Building2, 'Hotel Management — properties, rates, staff'], [Users, 'Front Desk — guests, bookings, invoices'], [Wrench, 'Operations — housekeeping & maintenance']] as const;
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[530px] shrink-0 flex-col gap-10 bg-gradient-to-br from-indigo-600 via-indigo-500 to-teal-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"><Sparkles size={22} /></div><div><div className="text-lg font-bold">HMS Cloud</div><div className="text-xs uppercase tracking-widest text-white/70">Hotel SaaS Platform</div></div></div>
        <div><h2 className="text-4xl font-bold leading-tight">Every hotel operation, one connected platform.</h2><ul className="mt-8 space-y-4 text-white/90">{pts.map(([I, t]) => <li key={t} className="flex items-center gap-3"><I size={18} />{t}</li>)}</ul></div>
      </div>
      <div className="grid flex-1 place-items-center bg-slate-50 p-6">
        <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div><h1 className="text-xl font-bold">Welcome back</h1><p className="mt-1 text-sm text-slate-500">Sign in with your work email.</p></div>
          <Alert msg={err} />
          <Field label="Email" required><input type="email" required autoFocus className={inputCls} value={email} onChange={e => setEmail(e.target.value)} /></Field>
          <Field label="Password" required><input type="password" required className={inputCls} value={password} onChange={e => setPassword(e.target.value)} /></Field>
          <Btn type="submit" disabled={busy} className="w-full"><LogIn size={16} />{busy ? 'Signing in…' : 'Sign in'}</Btn>
        </form>
      </div>
    </div>
  );
}
