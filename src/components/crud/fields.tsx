import { useEffect, useState } from 'react';
import { fmtDate, fmtTime } from '../../lib/format';
import { lookupService } from '../../services/lookupService';
import { Badge, Field, inputCls } from '../ui';
import { Col, Ref, Row } from './types';

export function useLookup(ref?: Ref) {
  const [d, setD] = useState<Row[]>([]);
  useEffect(() => { if (ref) lookupService.get(ref.path).then(setD); }, [ref?.path]);
  return d;
}
const loc = (v: string) => { const d = new Date(v); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); };
export const toForm = (c: Col, v: any) => v == null ? '' : c.type === 'date' ? String(v).slice(0, 10) : c.type === 'datetime' ? loc(v) : c.type === 'time' ? String(v).slice(0, 5) : v;
export const toBody = (c: Col, v: any) => {
  const e = v === '' || v == null;
  switch (c.type) {
    case 'number': case 'money': return e ? null : Number(v);
    case 'bool': return !!v;
    case 'date': return e ? null : v;
    case 'datetime': return e ? null : new Date(v).toISOString();
    case 'time': return e ? null : String(v).length === 5 ? v + ':00' : v;
    case 'ref': return e ? null : /^\d+$/.test(String(v)) ? Number(v) : v;
    default: return e ? '' : v;
  }
};
export function Cell({ c, v }: { c: Col; v: any }) {
  const lk = useLookup(c.ref);
  if (c.ref) { const m = lk.find(r => String(r[c.ref!.id]) === String(v)); return <>{m ? c.ref.label(m) : v ? 'Unknown' : '—'}</>; }
  if (c.type === 'bool') return <Badge text={v ? 'Active' : 'Inactive'} />;
  if (v == null || v === '') return <>—</>;
  if (c.type === 'date') return <>{fmtDate(v)}</>;
  if (c.type === 'datetime') return <>{fmtDate(v)} {fmtTime(v)}</>;
  if (c.type === 'time') return <>{String(v).slice(0, 5)}</>;
  if (c.type === 'money') return <>{Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>;
  if (c.type === 'select') return <Badge text={String(v)} />;
  return <span className={c.type === 'textarea' ? 'line-clamp-2 max-w-xs' : ''}>{String(v)}</span>;
}
export function Input({ c, v, set }: { c: Col; v: any; set: (x: any) => void }) {
  const lk = useLookup(c.ref);
  const p = { className: inputCls, value: v ?? '', required: c.req, onChange: (e: any) => set(e.target.value) };
  if (c.type === 'bool') return <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} />{c.label}</label>;
  const body = c.type === 'textarea' ? <textarea rows={3} maxLength={c.max} {...p} />
    : c.type === 'select' ? <select {...p}><option value="">Select</option>{c.options!.map(o => <option key={o}>{o}</option>)}</select>
    : c.type === 'ref' ? <select {...p}><option value="">Select</option>{lk.map(r => <option key={r[c.ref!.id]} value={r[c.ref!.id]}>{c.ref!.label(r)}</option>)}</select>
    : <input type={({ number: 'number', money: 'number', date: 'date', datetime: 'datetime-local', time: 'time', email: 'email' } as Record<string, string>)[c.type ?? ''] ?? 'text'} step={c.type === 'money' ? '0.01' : undefined} min={c.min} maxLength={c.max} {...p} />;
  return <Field label={c.label} required={c.req} hint={c.hint}>{body}</Field>;
}
