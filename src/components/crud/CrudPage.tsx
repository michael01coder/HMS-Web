import { FormEvent, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { crudService } from '../../services/crudService';
import { lookupService } from '../../services/lookupService';
import { Session } from '../../types';
import { Alert, Btn, Modal, Page, Table, inputCls } from '../ui';
import { Cell, Input, toBody, toForm } from './fields';
import { Cfg, Col, Row } from './types';

const defOf = (c: Col, u: Session) => (typeof c.def === 'function' ? c.def(u) : c.def);

/** Config-driven list + create/edit/delete page. Permissions come from cfg.write / cfg.edit / cfg.del. */
export default function CrudPage({ cfg }: { cfg: Cfg }) {
  const { user, is } = useAuth(); const role = user!.role;
  const ok = (r?: string[]) => !r || is(...r);
  const canAdd = !cfg.noCreate && ok(cfg.write), canEdit = !cfg.noEdit && ok(cfg.edit ?? cfg.write), canDel = !cfg.noDelete && ok(cfg.del ?? cfg.write);
  const list = useLoad(() => crudService.list(cfg.listPath ?? cfg.path), [cfg.path]);
  const [m, setM] = useState<Row | null>(null); const [orig, setOrig] = useState<Row | null>(null); const [err, setErr] = useState(''); const [q, setQ] = useState('');
  const open = (row?: Row) => { setErr(''); setOrig(row ?? null); const init: Row = {}; cfg.cols.forEach(c => { init[c.key] = row ? toForm(c, row[c.key]) : (defOf(c, user!) ?? ''); }); setM(init); };
  const skip = (c: Col) => c.ro || (orig ? c.update === false : c.create === false);
  const save = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); const body: Row = {};
    cfg.cols.forEach(c => { if (skip(c)) return; const shown = !c.when || c.when(role); body[c.key] = toBody(c, shown ? m![c.key] : defOf(c, user!)); });
    try {
      if (!orig) await crudService.create(cfg.path, body);
      else { const id = orig[cfg.idKey]; await crudService.update(cfg.upd?.method ?? 'PUT', cfg.upd ? cfg.upd.path(id) : `${cfg.path}/${id}`, cfg.full ? { ...orig, ...body } : body); }
      lookupService.bust(cfg.path); cfg.cols.forEach(c => c.ref && lookupService.bust(c.ref.path)); setM(null); list.reload();
    } catch (x) { setErr((x as Error).message); }
  };
  const del = async (r: Row) => { if (!confirm('Delete this record?')) return; try { await crudService.remove(`${cfg.path}/${r[cfg.idKey]}`); lookupService.bust(cfg.path); list.reload(); } catch (x) { setErr((x as Error).message); } };
  const cols = cfg.cols.filter(c => c.list !== false);
  const rows = (list.d ?? []).filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  const fields = cfg.cols.filter(c => !skip(c) && (!c.when || c.when(role)));
  return (
    <Page title={cfg.title} sub={cfg.sub} actions={canAdd && <Btn onClick={() => open()}><Plus size={16} />Add new</Btn>}>
      <input className={inputCls + ' max-w-sm'} placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
      {!m && <Alert msg={err || list.e} />}
      <Table head={[...cols.map(c => c.label), '']} empty={!list.l && !rows.length}>
        {rows.map(r => <tr key={r[cfg.idKey]}>
          {cols.map(c => <td key={c.key}><Cell c={c} v={r[c.key]} /></td>)}
          <td className="whitespace-nowrap text-right">{cfg.extra?.(r, list.reload)}{canEdit && <button onClick={() => open(r)} className="ml-2 text-indigo-600" title="Edit"><Pencil size={16} /></button>}{canDel && <button onClick={() => del(r)} className="ml-2 text-rose-600" title="Delete"><Trash2 size={16} /></button>}</td>
        </tr>)}
      </Table>
      {m && <Modal title={orig ? `Edit — ${cfg.title}` : `Add — ${cfg.title}`} onClose={() => setM(null)}>
        <form onSubmit={save} className="space-y-4"><Alert msg={err} />
          <div className="grid grid-cols-2 gap-4">{fields.map(c => <div key={c.key} className={c.type === 'textarea' ? 'col-span-2' : ''}><Input c={c} v={m[c.key]} set={x => setM({ ...m, [c.key]: x })} /></div>)}</div>
          <div className="flex justify-end gap-3"><Btn type="button" variant="ghost" onClick={() => setM(null)}>Cancel</Btn><Btn type="submit">Save</Btn></div>
        </form></Modal>}
    </Page>
  );
}
