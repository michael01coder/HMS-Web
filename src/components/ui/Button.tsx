import { ButtonHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
export function Btn({ variant = 'primary', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const v = { primary: 'bg-indigo-600 text-white hover:bg-indigo-700', ghost: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50', danger: 'bg-rose-600 text-white hover:bg-rose-700' }[variant];
  return <button {...p} className={cx('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60', v, className)} />;
}
