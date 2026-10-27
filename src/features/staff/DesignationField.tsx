import { Designation } from '../../types';
import { designationService } from '../../services/designationService';
import { useLoad } from '../../hooks/useLoad';
import { Field, inputCls } from '../../components/ui';

/** Dropdown of predefined designations; falls back to free text only when none exist yet. */
export default function DesignationField({ value, onChange, departmentId }: { value: string; onChange: (v: string) => void; departmentId: string | number }) {
  const des = useLoad(() => designationService.list().catch(() => [] as Designation[]), []);
  const names = designationService.forDepartment(des.d ?? [], departmentId).map(d => d.designationName);
  if (!names.length) return <Field label="Designation" required hint="No designations defined yet. HR can add them under Designations."><input maxLength={50} className={inputCls} value={value} onChange={e => onChange(e.target.value)} /></Field>;
  const opts = value && !names.includes(value) ? [value, ...names] : names;
  return <Field label="Designation" required><select required className={inputCls} value={value} onChange={e => onChange(e.target.value)}><option value="">Select designation</option>{opts.map(n => <option key={n}>{n}</option>)}</select></Field>;
}
