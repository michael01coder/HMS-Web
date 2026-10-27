import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Alert, Btn, Modal } from '../../components/ui';
import UserForm from './UserForm';

export function UserModal({ title, role, tenantId, hotelId, onClose }: { title: string; role: string; tenantId?: string | null; hotelId?: string | null; onClose: () => void }) {
  const [done, setDone] = useState('');
  return <Modal title={title} onClose={onClose}>{done ? <div className="space-y-4"><Alert ok msg={`${role} login created for ${done}.`} /><Btn onClick={onClose}>Close</Btn></div> : <UserForm role={role} tenantId={tenantId} hotelId={hotelId} submitLabel={`Create ${role}`} onDone={setDone} />}</Modal>;
}
export function AddOwner({ hotel }: { hotel: Record<string, any> }) {
  const { user } = useAuth(); const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)} className="text-sm font-semibold text-indigo-600">Add owner</button>{open && <UserModal title={`Add owner — ${hotel.name}`} role="HotelOwner" tenantId={hotel.tenantId ?? user!.tenantId} hotelId={hotel.id} onClose={() => setOpen(false)} />}</>;
}
export function AddTenantAdmin({ tenant }: { tenant: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)} className="text-sm font-semibold text-indigo-600">Add admin</button>{open && <UserModal title={`Add admin — ${tenant.companyName}`} role="TenantAdmin" tenantId={tenant.id} onClose={() => setOpen(false)} />}</>;
}
