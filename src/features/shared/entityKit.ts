import { Col, Ref, Row } from '../../components/crud/types';

export const nm = (r: Row) => `${r.firstName} ${r.lastName}`;
export const PRI = ['Low', 'Medium', 'High', 'Urgent'];
/** Lookup sources used by dropdown (ref) columns. */
export const R: Record<string, Ref> = {
  tenants: { path: '/tenants', id: 'id', label: r => r.companyName },
  hotels: { path: '/hotels', id: 'id', label: r => r.name },
  amenities: { path: '/amenities', id: 'id', label: r => r.name },
  roomTypes: { path: '/roomtypes', id: 'id', label: r => r.typeName },
  rooms: { path: '/rooms', id: 'id', label: r => `Room ${r.roomNumber}` },
  guests: { path: '/guests', id: 'guestId', label: nm },
  staff: { path: '/staffs', id: 'staffId', label: nm },
  bookings: { path: '/bookings', id: 'bookingId', label: r => r.bookingReference },
  invoices: { path: '/invoices', id: 'id', label: r => r.invoiceNumber },
  departments: { path: '/departments', id: 'departmentId', label: r => r.departmentName },
};
export const ref = (key: string, label: string, r: Ref, o: Partial<Col> = {}): Col => ({ key, label, type: 'ref', ref: r, req: true, ...o });
export const t = (key: string, label: string, o: Partial<Col> = {}): Col => ({ key, label, type: 'text', ...o });
export const sel = (key: string, label: string, options: string[], o: Partial<Col> = {}): Col => ({ key, label, type: 'select', options, req: true, ...o });
export const num = (key: string, label: string, o: Partial<Col> = {}): Col => ({ key, label, type: 'number', ...o });
export const bool = (key: string, label: string, o: Partial<Col> = {}): Col => ({ key, label, type: 'bool', def: true, ...o });
export const ro = (key: string, label: string, type?: Col['type']): Col => ({ key, label, type, ro: true });
export const hotelCol = ref('hotelId', 'Hotel', R.hotels, { update: false, def: (u: any) => u.hotelId ?? '' });
/** Hidden column that stamps the signed-in user's hotel on create. */
export const hiddenHotel: Col = { key: 'hotelId', label: 'Hotel', type: 'text', update: false, list: false, when: () => false, def: (u: any) => u.hotelId ?? '' };
