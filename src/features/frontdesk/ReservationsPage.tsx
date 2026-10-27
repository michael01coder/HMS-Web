import { FormEvent, useState } from 'react';
import { Alert, Btn, Card, Field, Page, inputCls } from '../../components/ui';
import { Cell, Input, toBody } from '../../components/crud/fields';
import { Col, Row } from '../../components/crud/types';
import { http } from '../../lib/http';
import { lookupService } from '../../services/lookupService';
import { R, ref, t, sel } from '../shared/entityKit';

const cols: Col[] = [ref('bookingId', 'Booking', R.bookings), ref('guestId', 'Guest', R.guests), t('reservationCode', 'Reservation code', { req: true }), sel('reservationStatus', 'Status', ['Active', 'Cancelled', 'Completed']), t('specialRequests', 'Special requests', { type: 'textarea' })];
export default function ReservationsPage() {
  const [f, setF] = useState<Row>({ bookingId: '', guestId: '', reservationCode: '', reservationStatus: 'Active', specialRequests: '' });
  const [code, setCode] = useState(''); const [found, setFound] = useState<Row | null>(null); const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const create = async (e: FormEvent) => { e.preventDefault(); setErr(''); setOk(''); const b: Row = {}; cols.forEach(c => { b[c.key] = toBody(c, f[c.key]); }); try { await http('/reservations', 'POST', b); lookupService.bust('/reservations'); setOk('Reservation created.'); } catch (x) { setErr((x as Error).message); } };
  const look = async (e: FormEvent) => { e.preventDefault(); setErr(''); setFound(null); try { setFound(await http<Row>(`/reservations/code/${encodeURIComponent(code.trim())}`)); } catch (x) { setErr((x as Error).message); } };
  const cancel = async () => { try { await http(`/reservations/${found!.reservationId}`, 'DELETE'); setFound(null); setOk('Reservation cancelled.'); } catch (x) { setErr((x as Error).message); } };
  return (
    <Page title="Reservations" sub="Create a reservation or look one up by its code.">
      <Alert msg={err} /><Alert msg={ok} ok />
      <Card className="max-w-3xl p-6"><form onSubmit={create} className="grid grid-cols-2 gap-4">{cols.map(c => <div key={c.key} className={c.type === 'textarea' ? 'col-span-2' : ''}><Input c={c} v={f[c.key]} set={x => setF({ ...f, [c.key]: x })} /></div>)}<div className="col-span-2"><Btn type="submit">Create reservation</Btn></div></form></Card>
      <Card className="max-w-3xl p-6"><form onSubmit={look} className="flex items-end gap-3"><div className="flex-1"><Field label="Find by code"><input required className={inputCls} value={code} onChange={e => setCode(e.target.value)} /></Field></div><Btn type="submit">Search</Btn></form>
        {found && <div className="mt-5 space-y-1 text-sm"><div><b>{found.reservationCode}</b> — {found.reservationStatus}</div><div>Guest: <Cell c={cols[1]} v={found.guestId} /> · Booking: <Cell c={cols[0]} v={found.bookingId} /></div><div className="text-slate-500">{found.specialRequests || 'No special requests'}</div><Btn variant="danger" className="mt-3" onClick={cancel}>Cancel reservation</Btn></div>}</Card>
    </Page>
  );
}
