import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { crudService } from '../../services/crudService';
import { cx } from '../../lib/cx';
import { Alert, Btn, Card, Field, Page, inputCls } from '../../components/ui';
import UserForm from './UserForm';

const blank = { companyName: '', contactEmail: '', contactPhone: '', subscriptionId: '' };
export default function OnboardTenantPage() {
  const [step, setStep] = useState(1); const [tenant, setTenant] = useState<Record<string, any> | null>(null); const [adminEmail, setAdminEmail] = useState('');
  const [f, setF] = useState(blank); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const mk = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { setTenant(await crudService.create('/tenants', { companyName: f.companyName.trim(), contactEmail: f.contactEmail.trim(), contactPhone: f.contactPhone.trim(), subscriptionId: f.subscriptionId ? Number(f.subscriptionId) : null })); setStep(2); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  const reset = () => { setStep(1); setTenant(null); setAdminEmail(''); setF(blank); };
  const steps = ['Create tenant', 'Create tenant admin', 'Done'];
  return (
    <Page title="Onboard tenant" sub="Create the company, then its admin. The admin will add hotels and owners.">
      <div className="flex max-w-3xl gap-3">{steps.map((s, n) => <div key={s} className={cx('flex flex-1 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold', step > n + 1 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : step === n + 1 ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-400')}>{step > n + 1 ? <Check size={16} /> : <span>{n + 1}</span>}{s}</div>)}</div>
      <Card className="max-w-3xl p-6">
        {step === 1 && <form onSubmit={mk} className="space-y-4"><Alert msg={err} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company name" required><input required maxLength={150} className={inputCls} value={f.companyName} onChange={e => setF({ ...f, companyName: e.target.value })} /></Field>
            <Field label="Contact email" required><input required type="email" maxLength={100} className={inputCls} value={f.contactEmail} onChange={e => setF({ ...f, contactEmail: e.target.value })} /></Field>
            <Field label="Contact phone"><input maxLength={20} className={inputCls} value={f.contactPhone} onChange={e => setF({ ...f, contactPhone: e.target.value })} /></Field>
            <Field label="Subscription ID"><input type="number" min="1" className={inputCls} value={f.subscriptionId} onChange={e => setF({ ...f, subscriptionId: e.target.value })} /></Field>
          </div><Btn type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create tenant'}</Btn></form>}
        {step === 2 && tenant && <div className="space-y-4"><p className="text-sm text-slate-600">Tenant <b>{tenant.companyName ?? f.companyName}</b> created. Now create its admin account.</p><UserForm role="TenantAdmin" tenantId={tenant.id ?? tenant.tenantId} submitLabel="Create tenant admin" onDone={e => { setAdminEmail(e); setStep(3); }} /></div>}
        {step === 3 && <div className="space-y-4"><Alert ok msg={`${tenant?.companyName ?? f.companyName} is ready. ${adminEmail} can now sign in and add hotels.`} /><div className="flex gap-3"><Btn onClick={reset}>Onboard another</Btn><Link to="/tenants"><Btn variant="ghost">View tenants</Btn></Link></div></div>}
      </Card>
    </Page>
  );
}
