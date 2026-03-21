# AIEA Membership Popup

## Current State
The app has a complaint submission system where visitors can submit complaints with name, phone, subject, message, and optional image. Complaints are stored in the backend via `submitComplaint` and retrievable via `getComplaints`.

## Requested Changes (Diff)

### Add
- Admin page/view accessible via a secret/password-protected route or simple password gate
- Displays all submitted complaints in a list/table with name, phone, subject, message, timestamp, and image (if any)
- Nav link or hidden access route for admin

### Modify
- App.tsx: add routing or conditional rendering for admin view
- Navigation: add an admin link (or keep it hidden/accessible via URL)

### Remove
- Nothing removed

## Implementation Plan
1. Create `AdminPage` component that fetches and displays all complaints from `getComplaints`
2. Add simple password gate (hardcoded password prompt) to protect admin view
3. Add route `/admin` or toggle via URL hash `#admin`
4. Display complaints in a card/table layout with all fields and image thumbnail
5. Add discreet Admin link in footer
