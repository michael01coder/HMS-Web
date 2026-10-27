import { ReactNode } from 'react';
import { Card } from './Card';
export const Table = ({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) => (
  <Card className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500"><tr>{head.map((h, i) => <th key={i} className="px-5 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 [&_td]:px-5 [&_td]:py-3.5">{children}</tbody></table>{empty && <p className="px-5 py-10 text-center text-slate-400">Nothing here yet.</p>}</Card>
);
