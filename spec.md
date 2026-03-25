# AIEA Membership Site

## Current State
Full-stack AIEA landing page with complaint box, licence application form, admin panel (Complaints, Licence Applications, Traffic tabs), and real-time traffic analytics. Site goes blank on visit due to unhandled render errors — no error boundary exists anywhere in the component tree.

## Requested Changes (Diff)

### Add
- React ErrorBoundary component wrapping the entire App to prevent blank screens on render errors

### Modify
- AdminPage.tsx: Remove the Traffic tab (button, TrafficTab component, and all related state/logic). Admin panel should only show Complaints and Licence Applications tabs.
- App.tsx: Wrap root render with ErrorBoundary; remove traffic-related useEffect calls (recordPageView, sendHeartbeat) that use `(actor as any)` casting since they add unnecessary complexity and can silently fail
- AdminPage.tsx: Remove `activeTab` type from including 'traffic', update subtitle text to remove 'traffic' mention

### Remove
- TrafficTab function component from AdminPage.tsx
- All traffic-related imports in AdminPage (Activity, Globe, Wifi icons if unused)
- recordPageView/sendHeartbeat useEffect in App.tsx

## Implementation Plan
1. Create `src/frontend/src/components/ErrorBoundary.tsx` - class component that catches render errors and shows a friendly reload message
2. Wrap `<App />` in main.tsx with ErrorBoundary, OR wrap the return in App.tsx
3. In AdminPage.tsx: change activeTab type to `'complaints' | 'applications'`, remove the Traffic tab button, remove the TrafficTab component render, remove the TrafficTab function, remove unused icon imports
4. In App.tsx: remove the useEffect that calls recordPageView and sendHeartbeat (these are traffic tracking calls that can fail silently and complicate the code)
5. Validate and build
