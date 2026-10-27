import { Session } from '../types';
const KEY = 'hms';
export const session = {
  get(): Session | null { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } },
  set(v: Session) { localStorage.setItem(KEY, JSON.stringify(v)); },
  clear() { localStorage.removeItem(KEY); },
};
