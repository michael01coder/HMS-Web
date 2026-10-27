import { ReactNode } from 'react';
import { cx } from '../../lib/cx';
export const Card = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cx('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
