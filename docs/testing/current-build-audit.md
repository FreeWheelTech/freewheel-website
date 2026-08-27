# Current Build Audit

## Frontend (Customer App)
| Issue | Severity | Affected App | Root Cause | Fix | Verification |
|-------|----------|--------------|------------|-----|--------------|
| **2-Minute Registration Hang** | CRITICAL | Customer | Axios client has no default timeout. If Android emulator cannot reach the backend network path immediately, the OS TCP connection waits 120s before failing. | Add `timeout: 10000` to global `axios.create()` in `api.ts`. | Pending |
| **Missing Restaurant Menu Screen** | HIGH | Customer | The `app/index.tsx` (Home) bypasses the restaurant list and renders the first restaurant's menu directly. The Zomato flow is broken. | Redesign `index.tsx` to list restaurants. Create `app/restaurant/[id].tsx` to show the restaurant's menu. | Pending |
| **Missing Global API URL Override** | MEDIUM | Customer / Owner | Hardcoding `10.0.2.2` limits testing on physical devices or alternate emulators (like Genymotion). | Support `process.env.EXPO_PUBLIC_API_URL` with a fallback to `10.0.2.2`. | Pending |
| **Unfriendly Error Messages** | LOW | Customer | Network failures or `409 Conflict` errors display raw messages or hang the UI. | Add safe `try/catch` UI alerts matching the Zomato spec. | Pending |

## Frontend (Owner App)
| Issue | Severity | Affected App | Root Cause | Fix | Verification |
|-------|----------|--------------|------------|-----|--------------|
| **Missing Network Timeout** | CRITICAL | Owner | Same as Customer App. | Add `timeout: 10000` to global `axios.create()`. | Pending |

## Backend & Database
| Issue | Severity | Affected App | Root Cause | Fix | Verification |
|-------|----------|--------------|------------|-----|--------------|
| **Incomplete Seed Data** | HIGH | Backend/DB | `seed.ts` only generates "BYTE++ Café" and doesn't create test accounts. The app looks empty and doesn't match Zomato's multi-restaurant vibe. | Update `seed.ts` to add multiple restaurants with Indian pricing, and seed test accounts. | Pending |
