# AIEA Membership Popup

## Current State
Full landing page with hero, stats, about, benefits, programs, CTA banner, and contact sections. Membership popup with timed/scroll triggers.

## Requested Changes (Diff)

### Add
- Complaint/Feedback box section on the landing page (visible in nav and page)
- Form fields: Name, Phone, Subject, Message (text area)
- Image upload field (attach photo evidence)
- Backend storage for complaints with uploaded images via blob-storage
- Success/error state feedback after submission
- "Complaint" nav link pointing to the new section

### Modify
- Nav links to include "Complaint" entry
- Backend to store complaint records (name, phone, subject, message, imageUrl, timestamp)

### Remove
- Nothing removed

## Implementation Plan
1. Select blob-storage component
2. Generate Motoko backend with submitComplaint and getComplaints APIs
3. Add ComplaintBox component to frontend with form + image upload
4. Add section to App.tsx and nav link
