import { Navigate, Route, Routes } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../features/auth/LoginPage';
import { items, NavItem } from './navigation';

function Guard({ item, children }: { item?: NavItem; children: ReactNode }) {
  const { user, ready, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!ready) return <div className="grid min-h-screen place-items-center text-slate-400">Loading…</div>;
  if (item && !can(item.roles, item.modules)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Guard><AppLayout /></Guard>}>
        {items.map(i => <Route key={i.to} path={i.to === '/' ? undefined : i.to.slice(1)} index={i.to === '/'} element={<Guard item={i}>{i.el}</Guard>} />)}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
