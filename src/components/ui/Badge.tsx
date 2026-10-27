import { cx } from '../../lib/cx';
const tones: Record<string, string> = { Approved: 'bg-emerald-50 text-emerald-700', Present: 'bg-emerald-50 text-emerald-700', Active: 'bg-emerald-50 text-emerald-700', Pending: 'bg-amber-50 text-amber-700', Incomplete: 'bg-amber-50 text-amber-700', Rejected: 'bg-rose-50 text-rose-700', Inactive: 'bg-slate-100 text-slate-600', Cancelled: 'bg-slate-100 text-slate-600' };
export const Badge = ({ text }: { text: string }) => <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold', tones[text] || 'bg-indigo-50 text-indigo-700')}>{text}</span>;
