import { FormEvent, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { crudService } from '../../services/crudService';
import { Alert, Btn, Page, Table } from '../ui';
import { Cell, Input, toBody } from './fields';
import { Col, Row } from './types';

/** Many-to-many link page (e.g. hotel <-> amenity). */
export default function LinkPage({ title, sub, path, a, b, write }: { title: string; sub: string; path: string; a: Col; b: Col; write?: string[] }) {
  const { is } = useAuth(); const can = !write || is(...write);
  const list = useLoad(() => crudService.list(path), [path]); const [va, setA] = useState(''); const [vb, setB] = useState(''); const [err, setErr] = useState('');
  const add = async (e: FormEvent) => { e.preventDefault(); setErr(''); try { await crudService.create(path, { [a.key]: toBody(a, va), [b.key]: toBody(b, vb) }); setB(''); list.reload(); } catch (x) { setErr((x as Error).message); } };
  const del = async (r: Row) => { try { await crudService.remove(`${path}/${r[a.key]}/${r[b.key]}`); list.reload(); } catch (x) { setErr((x as Error).message); } };
  return (
    <Page title={title} sub={sub}>
      <Alert msg={err || list.e} />
      {can && <form onSubmit={add} className="flex max-w-3xl items-end gap-4"><div className="flex-1"><Input c={{ ...a, req: true }} v={va} set={setA} /></div><div className="flex-1"><Input c={{ ...b, req: true }} v={vb} set={setB} /></div><Btn type="submit">Link</Btn></form>}
      <Table head={[a.label, b.label, '']} empty={!list.l && !list.d?.length}>{list.d?.map(r => <tr key={`${r[a.key]}-${r[b.key]}`}><td><Cell c={a} v={r[a.key]} /></td><td><Cell c={b} v={r[b.key]} /></td><td className="text-right">{can && <button onClick={() => del(r)} className="text-rose-600"><Trash2 size={16} /></button>}</td></tr>)}</Table>
    </Page>
  );
}
