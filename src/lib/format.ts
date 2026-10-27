export const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (d: number) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
export const monthStart = () => today().slice(0, 8) + '01';
export const hhmm = (t?: string) => (t ? t.slice(0, 5) : '');
export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const fmtTime = (d?: string | null) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—');
export const hours = (n?: number) => (n ?? 0).toFixed(2);
