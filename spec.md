# AIEA Membership Popup

## Current State
- Backend stores complaints with `submitComplaint` / `getComplaints`
- LicenseApplicationForm collects form data locally but does NOT persist to backend
- AdminPage shows complaints only

## Requested Changes (Diff)

### Add
- `LicenseApplication` type in backend: id, fullName, mobile, email, dob, licenceType, address, district, state, timestamp, photo (optional ExternalBlob)
- `submitLicenseApplication` backend function
- `getLicenseApplications` backend function
- License Applications tab/section in AdminPage
- `LicenseApplicationCard` component inside AdminPage

### Modify
- `LicenseApplicationForm.tsx`: on submit, call `backend.submitLicenseApplication(...)` with form fields + passport photo as ExternalBlob
- `backend.d.ts`: add `LicenseApplication` interface and new function signatures
- `AdminPage.tsx`: add tabs (Complaints / Licence Applications), show licence applications

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with LicenseApplication record and CRUD functions
2. Update backend.d.ts with new types/functions
3. Update LicenseApplicationForm to call backend.submitLicenseApplication on submit
4. Update AdminPage to show two tabs: Complaints and Licence Applications
