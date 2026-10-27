import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { session } from '../lib/session';
import { authService } from '../services/authService';
import { staffService } from '../services/staffService';
import { modulesFor, Module } from '../config/departmentAccess';
import { STAFF_ROLES } from '../config/roles';
import { Session, Staff } from '../types';

interface Ctx {
  user: Session | null; profile: Staff | null; ready: boolean; modules: Module[];
  login: (e: string, p: string) => Promise<void>; logout: () => void; refreshProfile: () => Promise<void>;
  is: (...r: string[]) => boolean; can: (roles?: string[], modules?: Module[]) => boolean;
}
const C = createContext<Ctx>(null!);
export const useAuth = () => useContext(C);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(session.get());
  const [profile, setProfile] = useState<Staff | null>(null);
  const [ready, setReady] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (user && STAFF_ROLES.includes(user.role)) setProfile(await staffService.get(user.staffId).catch(() => null));
    else setProfile(null);
  }, [user]);
  useEffect(() => { setReady(false); refreshProfile().finally(() => setReady(true)); }, [refreshProfile]);

  const login = async (email: string, password: string) => { const r = await authService.login(email, password); session.set(r); setUser(r); };
  const logout = () => { session.clear(); setUser(null); setProfile(null); };
  const is = (...r: string[]) => !!user && r.includes(user.role);
  const modules = user ? modulesFor(user.role, profile?.departmentName) : [];
  const can = (roles?: string[], mods?: Module[]) => !!user && (!roles || roles.includes(user.role)) && (!mods || mods.some(m => modules.includes(m)));
  return <C.Provider value={{ user, profile, ready, modules, login, logout, refreshProfile, is, can }}>{children}</C.Provider>;
}
