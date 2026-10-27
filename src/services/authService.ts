import { http } from '../lib/http';
import { RegisterPayload, Session } from '../types';
export const authService = {
  login: (email: string, password: string) => http<Session>('/auth/login', 'POST', { email, password }),
  register: (p: RegisterPayload) => http('/auth/register', 'POST', p),
};
