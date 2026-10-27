import { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { attendanceService } from '../../services/attendanceService';
import { fmtTime, today } from '../../lib/format';
import { Alert, Btn, Card } from '../../components/ui';

/** One-tap clock in / out with today's status. Used on the dashboard and attendance page. */
export default function QuickClock({ onChange }: { onChange?: () => void }) {
  const { user } = useAuth(); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const day = useLoad(() => attendanceService.history(user!.staffId, today(), today()), []);
  const rows = day.d ?? []; const open = attendanceService.openRecord(rows); const last = rows[rows.length - 1];
  const status = open ? `Clocked in at ${fmtTime(open.clockInTime)}` : last?.clockOutTime ? `Clocked out at ${fmtTime(last.clockOutTime)}` : 'You have not clocked in today';
  const punch = async (kind: 'in' | 'out') => {
    setMsg(''); setBusy(true);
    try { await (kind === 'in' ? attendanceService.clockIn(user!.staffId) : attendanceService.clockOut(user!.staffId)); day.reload(); onChange?.(); }
    catch (x) { setMsg((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <Card className="max-w-4xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today</div><div className="mt-1 text-lg font-semibold">{status}</div></div>
        <div className="flex gap-3"><Btn disabled={busy || !!open} onClick={() => punch('in')}><LogIn size={16} />Clock in</Btn><Btn variant="ghost" disabled={busy || !open} onClick={() => punch('out')}><LogOut size={16} />Clock out</Btn></div>
      </div>
      <div className="mt-3 empty:hidden"><Alert msg={msg || day.e} /></div>
    </Card>
  );
}
