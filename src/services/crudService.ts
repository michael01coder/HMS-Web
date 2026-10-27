import { http } from '../lib/http';
export const crudService = {
  list: <T = Record<string, any>>(path: string) => http<T[]>(path),
  create: (path: string, body: unknown) => http(path, 'POST', body),
  update: (method: string, path: string, body: unknown) => http(path, method, body),
  remove: (path: string) => http(path, 'DELETE'),
};
