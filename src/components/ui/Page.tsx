import { ReactNode } from 'react';
export const Page = ({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) => (
  <div className="px-8 py-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-bold tracking-tight">{title}</h1>{sub && <p className="mt-1 text-slate-500">{sub}</p>}</div>{actions}</div><div className="space-y-6">{children}</div></div>
);
