import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../hooks/useLoad';
import { staffService } from '../../services/staffService';
import { fmtDate } from '../../lib/format';
import { Role } from '../../config/roles';
import { Staff } from '../../types';
import { Alert, Badge, Btn, Page, Table, inputCls } from '../../components/ui';
import StaffEditModal from './StaffEditModal';

export default function StaffDirectoryPage() {
  const { is } = useAuth(); const hr = is(Role.HR);
  const list = useLoad(() => staffService.list(), []);
  const [q, setQ] = useState(''); const [edit, setEdit] = useState<Staff | null>(null); const [msg, setMsg] = useState('');
  const all = list.d ?? [];
  const rows = all.filter(s => `${s.firstName} ${s.lastName} ${s.email} ${s.employeeCode}`.toLowerCase().includes(q.toLowerCase()));
  const del = async (s: Staff) => { if (!confirm(`Remove ${s.firstName} ${s.lastName}?`)) return; try { await staffService.remove(s.staffId); list.reload(); } catch (x) { setMsg((x as Error).message); } };
  return (
    <Page title="Staff directory" sub={hr ? 'Everyone at your property. Profiles marked Incomplete still need HR details.' : 'People you can view. Open a profile to see their attendance and leave history.'} actions={hr && <Link to="/staffs/new"><Btn><UserPlus size={16} />Create staff login</Btn></Link>}>
      <input className={inputCls + ' max-w-sm'} placeholder="Search name, email or code" value={q} onChange={e => setQ(e.target.value)} />
      <Alert msg={msg || list.e} />
      <Table head={['Code', 'Name', 'Department', 'Designation', 'Role', 'Joined', 'Status', '']} empty={!list.l && !rows.length}>
        {rows.map(s => <tr key={s.staffId}>
          <td className="font-mono text-xs">{s.employeeCode}</td>
          <td><div className="font-semibold">{s.firstName} {s.lastName}</div><div className="text-xs text-slate-500">{s.email}</div></td>
          <td>{s.departmentName ?? '—'}</td><td>{s.designation || '—'}</td><td>{s.role}</td><td>{staffService.isIncomplete(s) ? '—' : fmtDate(s.joiningDate)}</td>
          <td><Badge text={!s.isActive ? 'Inactive' : staffService.isIncomplete(s) ? 'Incomplete' : 'Active'} /></td>
          <td className="whitespace-nowrap text-right"><Link to={`/staffs/${s.staffId}`} title="History" className="mr-2 inline-block text-slate-500"><Eye size={16} /></Link>{hr && <><button onClick={() => setEdit(s)} className="mr-2 text-indigo-600" title="Edit"><Pencil size={16} /></button><button onClick={() => del(s)} className="text-rose-600" title="Delete"><Trash2 size={16} /></button></>}</td>
        </tr>)}
      </Table>
      {edit && <StaffEditModal s={edit} all={all} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </Page>
  );
}
