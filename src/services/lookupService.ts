import { http } from '../lib/http';
const cache: Record<string, Promise<Record<string, any>[]>> = {};
export const lookupService = {
  get: (path: string) => (cache[path] ??= http<Record<string, any>[]>(path).catch(() => [])),
  bust: (path: string) => { delete cache[path]; },
};
