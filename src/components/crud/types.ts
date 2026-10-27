import { ReactNode } from 'react';
export type Row = Record<string, any>;
export interface Ref { path: string; id: string; label: (r: Row) => string }
export interface Col {
  key: string; label: string; type?: 'text' | 'number' | 'money' | 'date' | 'datetime' | 'bool' | 'select' | 'email' | 'textarea' | 'time' | 'ref';
  req?: boolean; max?: number; min?: number; options?: string[]; ref?: Ref; list?: boolean; create?: boolean; update?: boolean; ro?: boolean;
  when?: (role: string) => boolean; def?: any; hint?: string;
}
export interface Cfg {
  title: string; sub: string; path: string; listPath?: string; idKey: string; cols: Col[];
  write?: string[]; edit?: string[]; del?: string[]; noCreate?: boolean; noEdit?: boolean; noDelete?: boolean;
  upd?: { method: string; path: (id: any) => string }; full?: boolean; extra?: (row: Row, reload: () => void) => ReactNode;
}
