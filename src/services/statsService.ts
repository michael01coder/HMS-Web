import { http } from '../lib/http';
export const statsService = { count: async (path: string, filter: (r: any) => boolean = () => true) => { try { return String((await http<any[]>(path)).filter(filter).length); } catch { return '—'; } } };
