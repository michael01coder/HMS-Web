# HMS Cloud — Flow Checklist

Tick each item once the flow works. ⚙️ = needs the backend fixes discussed earlier.

## 1. Setup and login
- [x] SuperAdmin (seeded) signs in and the sidebar shows only Tenants and Onboard Tenant
- [ ] Wrong password shows an error and doesn't sign in
- [x] Sign out, then refreshing a page while signed out goes to /login

## 2. SuperAdmin onboarding
- [x] Onboard Tenant step 1 creates the tenant
- [x] Step 2 creates the TenantAdmin using that tenant id
- [x] Tenants list shows the tenant, and "Add admin" works

## 3. TenantAdmin
- [x] TenantAdmin signs in and sees Hotels
- [x] Creating a hotel attaches it to their tenant
- [x] "Add owner" on the hotel row creates a HotelOwner who can sign in

## 4. HotelOwner
- [x] Owner signs in with no errors (no name lookup failure)
- [x] Add department works, and edit and delete work
- [x] Create HR login only offers the HR role
- [x] Owner can open the Staff Directory (read-only) ⚙️ and Departments

## 5. HR
- [x] HR signs in and the dashboard shows stats and the clock card
- [ ] Add designations (with and without a department) ⚙️
- [ ] Amenities, room types, rooms, rate plans and both link pages: HR can create and edit
- [x] Create Staff Login only offers Manager and Staff
- [x] A new Manager and a new Staff appear in the directory as "Incomplete"
- [x] Complete profile: employee code is read-only, designation is a dropdown, salary and joining date are required
- [x] After a Manager is created, the Reports to dropdown for same-department staff lists them ⚙️
- [ ] My Profile: HR edits name, phone and designation and it saves
- [x] The eye icon on a staff row opens attendance and leave history

## 6. Manager
- [x] Sees only their own department's staff
- [x] Doesn't see Departments or Designations in the sidebar
- [x] Sees only the modules their department unlocks
- [x] Can allocate shifts to the team but can't allocate to themselves
- [x] Can't create shift timings (no New shift form)
- [x] Leave page shows pending approvals and the Team approved leave log

## 7. Staff
- [x] Staff sees only their own menu, with no Staff Directory
- [x] Dashboard Clock in and Clock out update the status, and show in Attendance
- [x] Apply for leave shows the days count and the balance hint, and it appears as Pending
- [x] Shift swap request has no partner field, only a shift and a reason

## 8. Leave flow
- [x] Manager approves, and the Staff request becomes Approved
- [x] Approved leave appears in the Team log and in that staff member's history
- [x] Rejecting a request sets Rejected

## 9. Shifts and swaps
- [x] HR creates a shift with category and times only
- [x] Allocating a date range gives each person a row
- [x] HR or Manager assigns a partner to a swap, and approval succeeds ⚙️
- [x] The names show correctly, with no 0000 anywhere ⚙️
- [ ] The swapped shifts actually move to the other person ⚙️

## 10. Department navigation
- [ ] Front Desk staff see Guests, Bookings, Reservations, Invoices, Payments
- [ ] Housekeeping staff see Housekeeping, Inspections, Lost & Found, Task Assignments
- [ ] Maintenance staff see Maintenance
- [ ] A department with an unrecognised name sees no operational modules
- [ ] Typing a restricted URL by hand redirects to the dashboard

## 11. Front desk and operations
- [ ] Guest, booking, invoice and payment: create and edit
- [ ] Reservation: create, find by code, cancel
- [ ] Housekeeping, maintenance, service request, inspection and task assignment: create and edit
- [ ] Lost & Found: add, mark claimed, delete
