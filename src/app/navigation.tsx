import { ReactNode } from 'react';
import { LayoutDashboard, Users, UserPlus, Building2, Clock, CalendarDays, CalendarClock, Repeat, Landmark, Hotel, Sparkles, BedDouble, DoorOpen, Tag, Link2, BookOpen, CalendarCheck, Receipt, CreditCard, Brush, Wrench, ConciergeBell, PackageSearch, ClipboardCheck, ListTodo, StickyNote, FileText, TriangleAlert, UserCircle, BadgeCheck, LucideIcon } from 'lucide-react';
import { Module } from '../config/departmentAccess';
import { ADMINS, HR_MANAGER, HR_ONLY, HR_OWNER, OWNERS, Role, STAFF_ROLES } from '../config/roles';
import CrudPage from '../components/crud/CrudPage';
import { Cfg } from '../components/crud/types';
import DashboardPage from '../features/dashboard/DashboardPage';
import OnboardTenantPage from '../features/onboarding/OnboardTenantPage';
import StaffDirectoryPage from '../features/staff/StaffDirectoryPage';
import StaffCreatePage from '../features/staff/StaffCreatePage';
import StaffProfilePage from '../features/staff/StaffProfilePage';
import MyProfilePage from '../features/staff/MyProfilePage';
import { staffEntities } from '../features/staff/staffEntities';
import { departmentEntities } from '../features/departments/departmentEntities';
import AttendancePage from '../features/attendance/AttendancePage';
import LeavePage from '../features/leave/LeavePage';
import ShiftsPage from '../features/shifts/ShiftsPage';
import SwapsPage from '../features/swaps/SwapsPage';
import { hotelEntities } from '../features/hotel/hotelEntities';
import { HotelAmenities, RoomTypeAmenities } from '../features/hotel/HotelLinks';
import { frontdeskEntities } from '../features/frontdesk/frontdeskEntities';
import ReservationsPage from '../features/frontdesk/ReservationsPage';
import { operationsEntities } from '../features/operations/operationsEntities';

export interface NavItem { group: string; to: string; label: string; icon: LucideIcon; el: ReactNode; roles?: string[]; modules?: Module[]; hidden?: boolean }

const crud = (cfg: Cfg) => <CrudPage cfg={cfg} />;
const SETUP = [...OWNERS, Role.HR];                                   // hotel setup screens: owners/admins view, HR writes
const OPS = [Role.TenantAdmin, Role.HotelOwner, Role.HR, Role.Manager, Role.Staff] as string[];
const FD: Module[] = ['frontdesk'], HK: Module[] = ['housekeeping'], MT: Module[] = ['maintenance'];
const n = (group: string, to: string, label: string, icon: LucideIcon, el: ReactNode, roles?: string[], modules?: Module[], hidden = false): NavItem => ({ group, to, label, icon, el, roles, modules, hidden });

/** Single source of truth for routes, sidebar entries and who may open them (role + department module). */
export const items: NavItem[] = [
  n('', '/', 'Dashboard', LayoutDashboard, <DashboardPage />),
  n('', '/profile', 'My Profile', UserCircle, <MyProfilePage />, STAFF_ROLES),

  n('Platform Admin', '/tenants', 'Tenants', Landmark, crud(hotelEntities.tenants), [Role.SuperAdmin]),
  n('Platform Admin', '/tenants/new', 'Onboard Tenant', UserPlus, <OnboardTenantPage />, [Role.SuperAdmin]),

  n('Hotel Management', '/hotels', 'Hotels', Hotel, crud(hotelEntities.hotels), SETUP),
  n('Hotel Management', '/amenities', 'Amenities', Sparkles, crud(hotelEntities.amenities), SETUP),
  n('Hotel Management', '/room-types', 'Room Types', BedDouble, crud(hotelEntities.roomTypes), SETUP),
  n('Hotel Management', '/rooms', 'Rooms', DoorOpen, crud(hotelEntities.rooms), SETUP),
  n('Hotel Management', '/rate-plans', 'Rate Plans', Tag, crud(hotelEntities.ratePlans), SETUP),
  n('Hotel Management', '/hotel-amenities', 'Hotel ↔ Amenities', Link2, <HotelAmenities />, SETUP),
  n('Hotel Management', '/room-type-amenities', 'Room Type ↔ Amenities', Link2, <RoomTypeAmenities />, SETUP),

  n('Staff', '/staffs', 'Staff Directory', Users, <StaffDirectoryPage />, [...HR_MANAGER, Role.HotelOwner]),
  n('Staff', '/staffs/new', 'Create Staff Login', UserPlus, <StaffCreatePage />, HR_OWNER),
  n('Staff', '/staffs/:id', 'Staff History', Users, <StaffProfilePage />, [...HR_MANAGER, Role.HotelOwner], undefined, true),
  n('Staff', '/departments', 'Departments', Building2, crud(departmentEntities.departments), HR_OWNER),
  n('Staff', '/designations', 'Designations', BadgeCheck, crud(departmentEntities.designations), HR_OWNER),
  n('Staff', '/staff-notes', 'Staff Notes', StickyNote, crud(staffEntities.staffNotes), HR_MANAGER),
  n('Staff', '/staff-documents', 'Staff Documents', FileText, crud(staffEntities.staffDocuments), STAFF_ROLES),

  n('Time & Attendance', '/attendance', 'Attendance', Clock, <AttendancePage />, STAFF_ROLES),
  n('Time & Attendance', '/anomalies', 'Anomalies', TriangleAlert, crud(staffEntities.anomalies), HR_MANAGER),
  n('Time & Attendance', '/leave', 'Leave', CalendarDays, <LeavePage />, STAFF_ROLES),
  n('Time & Attendance', '/shifts', 'Shifts', CalendarClock, <ShiftsPage />, STAFF_ROLES),
  n('Time & Attendance', '/swaps', 'Shift Swaps', Repeat, <SwapsPage />, STAFF_ROLES),

  n('Front Desk', '/guests', 'Guests', Users, crud(frontdeskEntities.guests), OPS, FD),
  n('Front Desk', '/bookings', 'Bookings', CalendarCheck, crud(frontdeskEntities.bookings), OPS, FD),
  n('Front Desk', '/reservations', 'Reservations', BookOpen, <ReservationsPage />, OPS, FD),
  n('Front Desk', '/invoices', 'Invoices', Receipt, crud(frontdeskEntities.invoices), OPS, FD),
  n('Front Desk', '/payments', 'Payments', CreditCard, crud(frontdeskEntities.payments), OPS, FD),

  n('Operations', '/housekeeping', 'Housekeeping', Brush, crud(operationsEntities.housekeeping), OPS, HK),
  n('Operations', '/maintenance', 'Maintenance', Wrench, crud(operationsEntities.maintenance), OPS, MT),
  n('Operations', '/service-requests', 'Service Requests', ConciergeBell, crud(operationsEntities.serviceRequests), OPS, [...FD, ...HK, ...MT]),
  n('Operations', '/lost-and-found', 'Lost & Found', PackageSearch, crud(operationsEntities.lostAndFound), OPS, [...FD, ...HK]),
  n('Operations', '/inspections', 'Room Inspections', ClipboardCheck, crud(operationsEntities.roomInspections), OPS, HK),
  n('Operations', '/task-assignments', 'Task Assignments', ListTodo, crud(operationsEntities.taskAssignments), OPS, [...HK, ...MT]),
];
export const groups = [...new Set(items.map(i => i.group))];
void ADMINS; void HR_ONLY;
