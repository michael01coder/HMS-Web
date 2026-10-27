# HMS Cloud — Flow Checklist

Tick each item once the flow works. ⚙️ = needs the backend fixes discussed earlier.

## 1. Setup and login
- [ ] SuperAdmin (seeded) signs in and the sidebar shows only Tenants and Onboard Tenant
- [ ] Wrong password shows an error and doesn't sign in
- [ ] Sign out, then refreshing a page while signed out goes to /login

## 2. SuperAdmin onboarding
- [ ] Onboard Tenant step 1 creates the tenant
- [ ] Step 2 creates the TenantAdmin using that tenant id
- [ ] Tenants list shows the tenant, and "Add admin" works

## 3. TenantAdmin
- [ ] TenantAdmin signs in and sees Hotels
- [ ] Creating a hotel attaches it to their tenant
- [ ] "Add owner" on the hotel row creates a HotelOwner who can sign in

## 4. HotelOwner
- [ ] Owner signs in with no errors (no name lookup failure)
- [ ] Add department works, and edit and delete work
- [ ] Create HR login only offers the HR role
- [ ] Owner can open the Staff Directory (read-only) ⚙️ and Departments

## 5. HR
- [ ] HR signs in and the dashboard shows stats and the clock card
- [ ] Add designations (with and without a department) ⚙️
- [ ] Amenities, room types, rooms, rate plans and both link pages: HR can create and edit
- [ ] Create Staff Login only offers Manager and Staff
- [ ] A new Manager and a new Staff appear in the directory as "Incomplete"
- [ ] Complete profile: employee code is read-only, designation is a dropdown, salary and joining date are required
- [ ] After a Manager is created, the Reports to dropdown for same-department staff lists them ⚙️
- [ ] My Profile: HR edits name, phone and designation and it saves
- [ ] The eye icon on a staff row opens attendance and leave history

## 6. Manager
- [ ] Sees only their own department's staff
- [ ] Doesn't see Departments or Designations in the sidebar
- [ ] Sees only the modules their department unlocks
- [ ] Can allocate shifts to the team but can't allocate to themselves
- [ ] Can't create shift timings (no New shift form)
- [ ] Leave page shows pending approvals and the Team approved leave log

## 7. Staff
- [ ] Staff sees only their own menu, with no Staff Directory
- [ ] Dashboard Clock in and Clock out update the status, and show in Attendance
- [ ] Apply for leave shows the days count and the balance hint, and it appears as Pending
- [ ] Shift swap request has no partner field, only a shift and a reason

## 8. Leave flow
- [ ] Manager approves, and the Staff request becomes Approved
- [ ] Approved leave appears in the Team log and in that staff member's history
- [ ] Rejecting a request sets Rejected

## 9. Shifts and swaps
- [ ] HR creates a shift with category and times only
- [ ] Allocating a date range gives each person a row
- [ ] HR or Manager assigns a partner to a swap, and approval succeeds ⚙️
- [ ] The names show correctly, with no 0000 anywhere ⚙️
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
