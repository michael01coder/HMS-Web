import { ReactNode } from 'react';
export const inputCls = 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';
export const Field = ({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) => (
  <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}{required && <span className="text-rose-500"> *</span>}</span>{children}{hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}</label>
);
