import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, Sparkles, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { groups, items } from '../../app/navigation';
import { cx } from '../../lib/cx';

export default function AppLayout() {
  const { user, profile, logout, can } = useAuth();
  const name = profile ? `${profile.firstName} ${profile.lastName}` : user!.email;
  const initials = profile ? (profile.firstName[0] + profile.lastName[0]).toUpperCase() : user!.email.slice(0, 2).toUpperCase();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-[325px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-5">
        <div className="mb-6 flex items-center gap-3 px-1"><div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><Sparkles size={20} /></div><div><div className="font-bold leading-tight">HMS Cloud</div><div className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Hotel SaaS Platform</div></div></div>
        {groups.map(g => { const its = items.filter(i => i.group === g && !i.hidden && can(i.roles, i.modules)); return its.length ? (
          <div key={g} className="mb-4">{g && <div className="mb-2 mt-4 px-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{g}</div>}
            {its.map(i => <NavLink key={i.to} to={i.to} end className={({ isActive }) => cx('mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium', isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50')}><i.icon size={18} />{i.label}</NavLink>)}
          </div>) : null; })}
        <div className="mt-auto rounded-xl bg-indigo-50/60 p-4 text-sm"><div className="text-xs text-slate-500">Signed in as</div><div className="font-semibold">{user!.role}</div>{profile?.departmentName && <div className="text-xs text-slate-500">{profile.departmentName} department</div>}</div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div className="relative w-96"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input disabled placeholder="Search across the platform..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm" /></div>
          <div className="flex items-center gap-4"><Bell size={20} className="text-slate-500" /><div className="text-right text-sm"><div className="font-semibold">{name}</div><div className="text-slate-500">{user!.role}</div></div><div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{initials}</div><button onClick={logout} title="Sign out" className="text-slate-500 hover:text-slate-900"><LogOut size={20} /></button></div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
