import { cx } from '../../lib/cx';
export const Alert = ({ msg, ok }: { msg?: string; ok?: boolean }) => msg ? <div className={cx('rounded-lg px-4 py-3 text-sm', ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>{msg}</div> : null;
