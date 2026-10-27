import { Link } from 'react-router-dom';
import { Users, CalendarDays, Repeat, Landmark, Hotel, CalendarCheck, Receipt, ConciergeBell, ArrowUpRight, LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { statsService } from '../../services/statsService';
import { STAFF_ROLES } from '../../config/roles';
import { Card, Page } from '../../components/ui';
import { items } from '../../app/navigation';
import QuickClock from '../attendance/QuickClock';

type Stat = [label: string, route: string, api: string, icon: LucideIcon, filter: (r: any) => boolean];
const DEFS: Stat[] = [
  ['Tenants', '/tenants', '/tenants', Landmark, () => true],
  ['Hotels', '/hotels', '/hotels', Hotel, () => true],
  ['Active bookings', '/bookings', '/bookings', CalendarCheck, r => ['Confirmed', 'CheckedIn', 'Pending'].includes(String(r.status))],
  ['Unpaid invoices', '/invoices', '/invoices', Receipt, r => !['Paid', 'Cancelled'].includes(String(r.status))],
  ['Open service requests', '/service-requests', '/servicerequests', ConciergeBell, r => !['Completed', 'Cancelled', 'Closed'].includes(String(r.status))],
  ['Staff', '/staffs', '/staffs', Users, () => true],
  ['Pending leave', '/leave', '/leaveapplications/pending', CalendarDays, () => true],
  ['Pending swaps', '/swaps', '/shifts/swaps/pending', Repeat, () => true],
];
export default function DashboardPage() {
  const { user, profile, can, is } = useAuth();
  const visible = DEFS.filter(d => { const it = items.find(x => x.to === d[1]); return !it || can(it.roles, it.modules); }).filter(d => !(['Pending leave', 'Pending swaps'].includes(d[0]) && !is('HR', 'Manager')));
  const stats = useLoad(() => Promise.all(visible.map(d => statsService.count(d[2], d[4]))), [visible.length]);
  const quick = items.filter(i => i.to !== '/' && !i.hidden && can(i.roles, i.modules)).slice(0, 8);
  return (
    <Page title={`Welcome back${profile ? ', ' + profile.firstName : ''}`} sub={`Here's what's happening across the platform for your role (${user!.role}${profile?.departmentName ? ` · ${profile.departmentName}` : ''}).`}>
      {STAFF_ROLES.includes(user!.role) && <QuickClock />}
      <div className="grid max-w-6xl grid-cols-4 gap-5">{visible.map(([l, , , I], n) => <Card key={l} className="p-5"><div className="flex items-start justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{l}</span><span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><I size={18} /></span></div><div className="mt-6 text-3xl font-bold">{stats.d?.[n] ?? '—'}</div></Card>)}</div>
      <div className="grid max-w-6xl grid-cols-2 gap-5">{quick.map(i => <Link key={i.to} to={i.to}><Card className="flex items-center gap-4 p-5 hover:border-indigo-300"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><i.icon size={20} /></span><div className="flex-1 font-semibold">{i.label}</div><ArrowUpRight size={16} className="text-slate-400" /></Card></Link>)}</div>
    </Page>
  );
}
