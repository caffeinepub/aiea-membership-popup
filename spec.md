# AIEA - Status Field for Licence Applications

## Current State
The admin panel shows submitted licence applications. Each application has id, fullName, mobile, email, dob, licenceType, address, district, state, timestamp, photo. There is no status tracking.

## Requested Changes (Diff)

### Add
- `status` field (Text) to `LicenseApplication` type, defaulting to "Pending" on submission
- `updateLicenseApplicationStatus(id: Nat, status: Text) : async Bool` backend function
- Status badge on each LicenseApplicationCard in the admin view
- Dropdown/select to change status (Pending / Approved / Rejected) per application
- Visual color coding: Pending=yellow, Approved=green, Rejected=red

### Modify
- `submitLicenseApplication` sets status to "Pending" on creation
- `LicenseApplicationCard` component to include status UI
- `backend.d.ts` to expose `status: string` field and `updateLicenseApplicationStatus` method

### Remove
Nothing removed.

## Implementation Plan
1. Update `main.mo`: add `status` to `LicenseApplication`, default to "Pending", add `updateLicenseApplicationStatus` function
2. Update `backend.d.ts`: add `status` field and new method signature
3. Update `AdminPage.tsx`: add status badge + inline select to change status, with optimistic UI and mutation call
