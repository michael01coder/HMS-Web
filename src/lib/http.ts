import { API_BASE } from '../config/env';
import { session } from './session';

export async function http<T = any>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const s = session.get();
  const r = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(s ? { Authorization: `Bearer ${s.accessToken}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (r.status === 401 && s && !path.startsWith('/auth')) { session.clear(); location.href = '/login'; }
  if (!r.ok) {
    let m = r.statusText || `Error ${r.status}`;
    try { const j = await r.json(); m = j.message || j.detail || j.title || (j.errors ? (Object.values(j.errors).flat() as string[]).join(', ') : m); } catch { /* ignore */ }
    throw new Error(m);
  }
  const t = await r.text();
  return (t ? JSON.parse(t) : undefined) as T;
}
export const qs = (o: Record<string, string | number>) => '?' + new URLSearchParams(Object.entries(o).map(([k, v]) => [k, String(v)])).toString();
