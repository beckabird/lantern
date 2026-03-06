# Lantern — Full Project Plan

A real-time dating app built around availability ("Lit" status), in-app currency (Oil), date proposals (Flickers), and verified date confirmations (Wick Tickets).

---

## 1. Folder / File Structure

Complete Expo (Expo Router) project layout:

```
lantern/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout (auth gate, providers)
│   ├── index.tsx                 # Redirect: auth → (onboard|app), else login
│   ├── (auth)/                   # Auth group (no tabs)
│   │   ├── _layout.tsx           # Stack: login, signup, forgot-password
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── onboarding/
│   │   ├── _layout.tsx           # Stack
│   │   ├── welcome.tsx           # App intro + CTA
│   │   ├── profile-basics.tsx    # Name, DOB, gender, photos
│   │   ├── preferences.tsx       # Who they want to meet, distance
│   │   ├── location.tsx          # Location permission + first geocode
│   │   └── complete.tsx          # "You're in" → navigate to app
│   ├── (app)/                    # Main app (tabs) — protected
│   │   ├── _layout.tsx           # Tab layout (Map, Flickers, Tickets, Profile)
│   │   ├── index.tsx             # Redirect to map tab
│   │   ├── map.tsx               # Lantern Map tab
│   │   ├── flickers.tsx          # My Flickers (sent + received)
│   │   ├── tickets.tsx           # Wick Tickets (upcoming + past)
│   │   └── profile.tsx           # Profile, Lit toggle, Oil, settings
│   ├── flicker/
│   │   ├── [id].tsx              # Single Flicker detail (send/view/accept)
│   ├── ticket/
│   │   ├── [id].tsx              # Wick Ticket detail + QR
│   ├── purchase-oil.tsx          # Oil pack purchase (modal or full screen)
│   └── +not-found.tsx
├── components/
│   ├── ui/                       # Primitives (Button, Input, Card, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── map/
│   │   ├── LanternMap.tsx        # Mapbox/Google map + heat/cluster of Lit users
│   │   ├── LitUserMarker.tsx     # Single Lit user marker (anon until Flicker)
│   │   └── MapLegend.tsx
│   ├── flicker/
│   │   ├── FlickerCard.tsx       # Summary card (sender/receiver, bid, time left)
│   │   ├── FlickerForm.tsx       # Compose: location, activity, time, Oil amount
│   │   ├── FlickerList.tsx       # List of Flickers with filters
│   │   └── FlickerCountdown.tsx  # Timer for auction window / Flicker expiry
│   ├── ticket/
│   │   ├── WickTicketCard.tsx    # Ticket summary (tier, date, partner)
│   │   ├── WickTicketQR.tsx      # QR code component for verification
│   │   └── WickTicketTierBadge.tsx
│   ├── profile/
│   │   ├── LitToggle.tsx         # Toggle Lit on/off + expiry picker
│   │   ├── OilBalance.tsx        # Display balance + "Get Oil" CTA
│   │   └── ProfilePhotoStack.tsx
│   ├── layout/
│   │   ├── ScreenContainer.tsx
│   │   └── TabBar.tsx            # Custom tab bar if needed
│   └── index.ts
├── hooks/
│   ├── useAuth.ts                # Auth state, session, sign out
│   ├── useUserProfile.ts         # Current user profile from Supabase
│   ├── useLitStatus.ts           # Am I Lit? Lit session CRUD, expiry
│   ├── useOilBalance.ts          # Oil balance, refresh after purchase
│   ├── useFlickers.ts            # Flickers sent/received, real-time
│   ├── useWickTickets.ts         # Tickets for user, real-time
│   ├── useLitUsersNearby.ts      # Lit users on map (real-time)
│   ├── useRealtimeChannel.ts     # Generic Supabase channel subscribe
│   └── useLocation.ts            # Geo permission, last location
├── lib/
│   ├── supabase.ts               # Supabase client (anon + optional RLS key)
│   ├── stripe.ts                 # Stripe SDK / payment sheet (Expo)
│   └── mapbox.ts                 # Mapbox client / token (or maps lib)
├── types/
│   ├── database.ts               # Generated or hand-written DB types
│   ├── flicker.ts
│   ├── ticket.ts
│   ├── user.ts
│   └── index.ts
├── utils/
│   ├── constants.ts              # Lit duration options, Oil pack SKUs, etc.
│   ├── validation.ts             # Forms, Oil min/max
│   ├── format.ts                 # Dates, currency, distance
│   └── qr.ts                     # QR generation for Wick Ticket
├── stores/                       # Optional: Zustand or context
│   └── appStore.ts               # Global UI state (e.g. selected Lit session)
├── assets/
│   ├── images/
│   └── fonts/
├── app.config.ts
├── package.json
├── tsconfig.json
└── PROJECT_PLAN.md               # This file
```

**Notes:**
- `(auth)` and `(app)` are Expo Router groups (no segment in URL).
- All Supabase access goes through `lib/supabase.ts`; RLS is enforced server-side.
- Types in `types/database.ts` should mirror Supabase schema for type safety.

---

## 2. Supabase Schema

### 2.1 Tables

**profiles** (extends auth.users)
- `id` uuid PK FK → auth.users(id)
- `email` text
- `display_name` text
- `date_of_birth` date
- `gender` text
- `avatar_url` text
- `bio` text (nullable)
- `preferred_gender` text[] (who they want to meet)
- `max_distance_km` int default 50
- `created_at` timestamptz
- `updated_at` timestamptz
- `onboarding_completed_at` timestamptz nullable

**lit_sessions**
- `id` uuid PK default gen_random_uuid()
- `user_id` uuid FK → profiles(id) ON DELETE CASCADE
- `started_at` timestamptz
- `expires_at` timestamptz
- `latitude` float
- `longitude` float
- `status` text check in ('active','expired','ended_early')
- `created_at` timestamptz
- `updated_at` timestamptz  
- Unique constraint: one active lit_sessions per user (status = 'active')

**flickers**
- `id` uuid PK default gen_random_uuid()
- `sender_id` uuid FK → profiles(id)
- `receiver_id` uuid FK → profiles(id)
- `lit_session_id` uuid FK → lit_sessions(id)
- `oil_amount` int (positive)
- `proposed_place_name` text
- `proposed_place_lat` float
- `proposed_place_lng` float
- `proposed_activity` text
- `proposed_at` timestamptz (when they want the date)
- `expires_at` timestamptz (Flicker bid expiry, e.g. when Lit session ends or custom)
- `status` text check in ('pending','accepted','rejected','expired')
- `created_at` timestamptz
- `updated_at` timestamptz
- Index: (receiver_id, status), (lit_session_id, status)

**wick_tickets**
- `id` uuid PK default gen_random_uuid()
- `flicker_id` uuid FK → flickers(id) unique
- `user_id_1` uuid FK → profiles(id)
- `user_id_2` uuid FK → profiles(id)
- `tier` text check in ('starter','burning_bright','wildfire')
- `oil_spent` int
- `place_name` text
- `place_lat` float
- `place_lng` float
- `activity` text
- `scheduled_at` timestamptz
- `qr_code_secret` text unique (for verification)
- `verified_at` timestamptz nullable (both showed QR)
- `created_at` timestamptz
- `updated_at` timestamptz

**oil_balances**
- `user_id` uuid PK FK → profiles(id) ON DELETE CASCADE
- `balance` int default 0 check (balance >= 0)
- `updated_at` timestamptz

**oil_transactions**
- `id` uuid PK default gen_random_uuid()
- `user_id` uuid FK → profiles(id)
- `amount` int (positive = credit, negative = debit)
- `type` text check in ('purchase','flicker_send','flicker_refund','admin_adjust')
- `reference_id` uuid nullable (e.g. flicker_id, stripe_payment_intent_id)
- `created_at` timestamptz
- Index: (user_id, created_at)

**notifications**
- `id` uuid PK default gen_random_uuid()
- `user_id` uuid FK → profiles(id)
- `type` text (e.g. 'flicker_received','flicker_accepted','auction_ending','ticket_reminder')
- `title` text
- `body` text
- `data` jsonb nullable (e.g. flicker_id, ticket_id)
- `read_at` timestamptz nullable
- `created_at` timestamptz
- Index: (user_id, read_at), (user_id, created_at)

**blocked_users** (optional but recommended)
- `id` uuid PK default gen_random_uuid()
- `blocker_id` uuid FK → profiles(id)
- `blocked_id` uuid FK → profiles(id)
- `created_at` timestamptz
- Unique (blocker_id, blocked_id)

### 2.2 Relationships Summary

- profiles 1 — N lit_sessions
- profiles 1 — N flickers (as sender)
- profiles 1 — N flickers (as receiver)
- lit_sessions 1 — N flickers
- flickers 1 — 1 wick_tickets (when accepted)
- profiles 1 — 1 oil_balances
- profiles 1 — N oil_transactions
- profiles 1 — N notifications

### 2.3 RLS Policies

**profiles**
- SELECT: own row; OR (other user not in blocked_users and not blocking me).
- INSERT: own row (via trigger on auth.users signup).
- UPDATE: own row only.

**lit_sessions**
- SELECT: own row; OR (other user’s row if status = 'active' and not blocked) for map.
- INSERT: own row only, and only one active per user (enforce in trigger or app).
- UPDATE: own row only (e.g. end_early, status = 'expired').
- DELETE: own row only.

**flickers**
- SELECT: sender_id = auth.uid() OR receiver_id = auth.uid().
- INSERT: sender_id = auth.uid(), and balance check via function.
- UPDATE: receiver_id = auth.uid() for status = 'accepted'|'rejected'; or sender for cancel.

**wick_tickets**
- SELECT: user_id_1 = auth.uid() OR user_id_2 = auth.uid().
- INSERT: only via trigger or Edge Function when a Flicker is accepted (not from client).
- UPDATE: no direct client updates (verification can be server/Edge Function).

**oil_balances**
- SELECT: user_id = auth.uid().
- INSERT: service role or trigger (create on profile create).
- UPDATE: only via Edge Function or trusted backend (purchase, deduct for Flicker).

**oil_transactions**
- SELECT: user_id = auth.uid().
- INSERT: service role / Edge Function only (no client insert).

**notifications**
- SELECT: user_id = auth.uid().
- INSERT: service role or Edge Function (on Flicker, accept, etc.).
- UPDATE: user_id = auth.uid() (e.g. read_at).

**blocked_users**
- SELECT/INSERT/DELETE: blocker_id = auth.uid().

### 2.4 Triggers / Functions

- **On signup**: insert into `profiles` (id, email from auth.users), insert into `oil_balances` (user_id, balance 0).
- **On Flicker accept**: deduct Oil from sender’s balance; insert `oil_transactions` (debit); insert `wick_tickets`; update `flicker.status`; reject/expire other Flickers for same `lit_session_id`; send notifications. Use Supabase Edge Function or DB function with security definer.
- **Lit session expiry**: cron or pg_cron to set `lit_sessions.status = 'expired'` and optionally expire related pending Flickers.

---

## 3. Screen List

| Screen | Route | Purpose | Key UI Elements | Reads | Writes |
|--------|--------|--------|------------------|-------|--------|
| Login | `/(auth)/login` | Sign in | Email, password, "Forgot?", link to Sign up | — | auth.signIn |
| Sign up | `/(auth)/signup` | Register | Email, password, confirm, ToS | — | auth.signUp |
| Forgot password | `/(auth)/forgot-password` | Reset password | Email input, submit | — | auth.resetPassword |
| Welcome | `/onboarding/welcome` | Intro to Lantern | Copy, "Get started" | — | — |
| Profile basics | `/onboarding/profile-basics` | Name, DOB, gender, photos | Form, image picker | — | profiles |
| Preferences | `/onboarding/preferences` | Who to meet, distance | Dropdowns, slider | — | profiles |
| Location | `/onboarding/location` | Enable location | Permission prompt, "Use my location" | — | profiles (optional cache) |
| Onboarding complete | `/onboarding/complete` | Done | Success message, "Go to app" | — | profiles.onboarding_completed_at |
| Map (Lantern Map) | `/(app)/map` | See Lit users, go Lit | LanternMap, LitToggle, OilBalance, FAB "Send Flicker" | lit_sessions (others), profiles (minimal), oil_balances | lit_sessions |
| Flickers list | `/(app)/flickers` | Sent + received Flickers | FlickerList, tabs (Received / Sent), FlickerCard, FlickerCountdown | flickers, profiles | flickers (accept/reject) |
| Flicker detail | `/flicker/[id]` | View one Flicker; accept/reject or edit | FlickerCard, FlickerCountdown, Accept/Reject, map pin | flickers, profiles, lit_sessions | flickers |
| Tickets list | `/(app)/tickets` | Upcoming + past Wick Tickets | WickTicketCard list, filter by upcoming/past | wick_tickets, profiles | — |
| Ticket detail | `/ticket/[id]` | Show QR, partner, place, time | WickTicketQR, WickTicketTierBadge, details | wick_tickets, profiles | — (optional: verified_at via backend) |
| Profile | `/(app)/profile` | Me, Lit toggle, Oil, settings | LitToggle, OilBalance, ProfilePhotoStack, edit profile, logout | profiles, oil_balances, lit_sessions | profiles, lit_sessions |
| Purchase Oil | `/purchase-oil` | Buy Oil packs | Pack options (SKUs), Stripe payment sheet, success | oil_balances, oil_transactions (read) | Stripe → Edge Function → oil_balances, oil_transactions |

---

## 4. Core Component Breakdown

| Component | Purpose | Props (key) | Behavior |
|-----------|--------|-------------|----------|
| **LanternMap** | Map with Lit users and heat | `region`, `litUsers[]`, `onUserSelect`, `heatMode` | Renders map; clusters or heat by bid activity; only shows users who are Lit; respects preferred_gender/max_distance. |
| **LitUserMarker** | One Lit user on map | `user` (id, coords, maybe bid count), `onPress` | Marker or cluster child; anonymized until Flicker (e.g. avatar blur or generic icon). |
| **MapLegend** | Explain heat / Lit | — | Legend for "Lit" and "Flicker activity" intensity. |
| **FlickerCard** | One Flicker summary | `flicker`, `variant` (sent|received), `onPress`, `onAccept`, `onReject` | Shows sender/receiver (based on variant), Oil bid, place, time, FlickerCountdown. |
| **FlickerForm** | Compose a Flicker | `litSessionId`, `receiverId`, `onSubmit`, `onCancel` | Oil amount (with balance check), place picker (map or search), activity, proposed_at; validates and submits to Supabase. |
| **FlickerList** | List of Flickers | `filter` (received|sent|all), `litSessionId?` | useFlickers; filters by status; FlickerCard list; pull-to-refresh. |
| **FlickerCountdown** | Timer to expiry | `expiresAt`, `onExpire?` | Countdown display; optional callback when time runs out. |
| **WickTicketCard** | Ticket in list | `ticket`, `onPress` | Tier badge, partner name, place, scheduled_at, "Show QR" hint. |
| **WickTicketQR** | QR for verification | `ticketId`, `qrCodeSecret` | Generates QR from `qr_code_secret` (or ticket id + secret); both users show at date. |
| **WickTicketTierBadge** | Tier label | `tier` | Starter / Burning Bright / Wildfire styling. |
| **LitToggle** | Go Lit / Unlit | `currentSession?`, `onToggle`, `durationOptions` | Toggle + duration selector; creates/ends lit_sessions; updates location. |
| **OilBalance** | Show balance + CTA | `balance`, `onGetOil` | Displays Oil amount; "Get Oil" opens purchase flow. |
| **ProfilePhotoStack** | Avatar(s) | `urls[]`, `size` | Stack or single avatar for profile/tickets. |

---

## 5. Real-time Logic

| Channel / Subscription | Scope | What to subscribe to | UI / Side effects |
|------------------------|--------|----------------------|-------------------|
| **Lit users nearby** | `lit_sessions` | Filter: `status eq 'active'`, optionally geo (or filter in app) | Update LanternMap markers; re-run "nearby" when location or filters change. |
| **My Flickers** | `flickers` | Filter: `sender_id eq me OR receiver_id eq me` | Update Flickers list and Flicker detail; show new Flicker notification. |
| **Flickers for current Lit session** | `flickers` | Filter: `receiver_id eq me AND lit_session_id eq currentSessionId` | On map or Flickers tab when Lit: live list of incoming Flickers; update countdowns. |
| **My Wick Tickets** | `wick_tickets` | Filter: `user_id_1 eq me OR user_id_2 eq me` | Update Tickets list when new ticket created or updated. |
| **My Oil balance** | `oil_balances` | Filter: `user_id eq me` | Refresh balance after purchase or after Flicker accept (debit). |
| **Notifications** | `notifications` | Filter: `user_id eq me` | Badge count, in-app list, optionally trigger push. |

**Implementation:** Use Supabase Realtime `postgres_changes` with filters above. Subscribe in relevant screens or in a global provider and push to context/state. Unsubscribe on unmount or when leaving Lit to avoid unnecessary updates.

---

## 6. Auth Flow

1. **App open**  
   - `_layout.tsx`: read Supabase session.  
   - If no session → redirect to `/(auth)/login` (or `index` → login).  
   - If session → check `profiles.onboarding_completed_at`.  
     - If null → redirect to `/onboarding/welcome`.  
     - Else → redirect to `/(app)/map` (or last tab).

2. **Sign up**  
   - User enters email + password on `signup.tsx`.  
   - `supabase.auth.signUp()`.  
   - Trigger creates `profiles` and `oil_balances` row.  
   - Redirect to `/onboarding/welcome`.

3. **Onboarding**  
   - **welcome**: intro, "Get started" → `profile-basics`.  
   - **profile-basics**: name, DOB, gender, photos → upload to Supabase Storage, save URLs in `profiles` → `preferences`.  
   - **preferences**: preferred_gender, max_distance_km → `profiles` → `location`.  
   - **location**: request location permission (Expo Location); optionally save last lat/lng to profile or only use in app → `complete`.  
   - **complete**: set `profiles.onboarding_completed_at = now()`, then redirect to `/(app)/map`.

4. **Login**  
   - Email + password → `signInWithPassword`.  
   - If no `onboarding_completed_at` → onboarding; else → app.

5. **Location**  
   - Request `foreground` permission before showing map or going Lit.  
   - Store last location in state or in `lit_sessions` when user goes Lit; do not store continuous location in DB for privacy.

---

## 7. Payment Flow (Oil + Stripe)

1. **Oil packs**  
   - Define products in Stripe (e.g. 10, 50, 100 Oil) and store product/price IDs in `utils/constants.ts`.

2. **Purchase**  
   - User taps "Get Oil" → navigate to `purchase-oil`.  
   - App calls backend (Supabase Edge Function or your API) to create Stripe PaymentIntent (or Checkout Session) with metadata `user_id`, `oil_amount`, `product_id`.  
   - Client opens Stripe payment sheet (Expo: `@stripe/stripe-react-native` or Stripe SDK).  
   - User pays; webhook receives `payment_intent.succeeded`.  
   - Webhook (or Edge Function):  
     - Insert `oil_transactions` (amount positive, type `purchase`, reference_id = payment_intent_id).  
     - Update `oil_balances` set balance = balance + amount where user_id = metadata.user_id.  
   - Client: poll or real-time subscribe to `oil_balances` to show new balance; optional short polling after closing sheet.

3. **Flicker send**  
   - Before insert into `flickers`, app (or Edge Function) checks `oil_balances.balance >= oil_amount`.  
   - Insert `flickers` row.  
   - Deduct: run Edge Function or DB function that decrements `oil_balances`, inserts `oil_transactions` (negative, type `flicker_send`, reference_id = flicker_id).  
   - If Flicker is later rejected/expired without accept, optional **refund**: credit back and `oil_transactions` type `flicker_refund`.

4. **Idempotency**  
   - Use Stripe idempotency keys when creating PaymentIntents.  
   - In webhook, guard by `reference_id` (payment_intent_id) so the same event doesn’t credit twice.

---

## 8. Build Order

1. **Scaffold & auth**  
   - Expo app with Expo Router, Supabase client, env vars.  
   - Auth: sign up, login, session in root layout, redirect to onboarding or app.

2. **Onboarding**  
   - Welcome → profile-basics (Supabase Storage for photos, profiles insert/update) → preferences → location (Expo Location) → complete (set onboarding_completed_at).

3. **Profiles & profile screen**  
   - RLS for profiles; profile screen with edit; LitToggle that only creates/ends lit_sessions (no map yet).

4. **Oil balance (no Stripe yet)**  
   - oil_balances + oil_transactions tables; seed test users with Oil; OilBalance component; display only.

5. **Lit sessions & map**  
   - LanternMap with Mapbox/Google; subscribe to active lit_sessions (other users); LitUserMarker; go Lit writes lit_sessions with location; auto-expire or manual end.

6. **Flickers (core)**  
   - FlickerForm (place, activity, time, Oil); send Flicker (deduct Oil via Edge Function); FlickerList (sent/received); FlickerCard + FlickerCountdown; real-time for my Flickers and for current Lit session.

7. **Accept Flicker → Wick Ticket**  
   - Accept button; Edge Function: deduct Oil (if not already), create wick_tickets, reject/expire other Flickers for that lit_sessions; notifications.

8. **Wick Tickets**  
   - Tickets list; ticket detail with WickTicketQR (qr_code_secret); tier from oil_spent.

9. **Stripe**  
   - Products/prices in Stripe; Edge Function to create PaymentIntent; client payment sheet; webhook to credit oil_balances + oil_transactions.

10. **Notifications**  
    - notifications table + RLS; Expo Push (register token, store in profile or separate table); send push on Flicker received, Flicker accepted, auction ending; in-app notification list/badge.

11. **Polish & safety**  
    - Blocked users; reporting; in-app terms/privacy; Apple-friendly profile guidelines.

12. **Launch prep**  
    - Natively.ai or manual: App Store listing, screenshots, privacy policy, age rating (17+), App Review notes for dating/real-time.

---

## 9. Key Risks

**Technical**  
- **Real-time scale**: Many concurrent Lit users and Flickers can mean a lot of postgres_changes. Mitigate: narrow filters (e.g. by region/cell), limit map query to bounding box, paginate Flicker list.  
- **Location freshness**: Lit position is set when they go Lit; if they move, you may need periodic update or “refresh location” in session. Balance freshness vs battery and privacy.  
- **Offline**: Map and lists may be stale offline. Consider caching last snapshot and queueing Flicker send for when back online.

**Apple / App Store**  
- **Dating apps**: Often 17+; expect review focus on safety (blocking, reporting, no minors). Implement block/report and clear content guidelines.  
- **In-app purchase**: If Oil is used only for Flickers (digital goods), Apple may require IAP for “consumable” and take a cut. If you position as “tips” or real-world service (date), Stripe may be acceptable; get legal/product guidance and be prepared for IAP.  
- **Push**: Expo Push requires proper entitlements and APNs; test on real device.

**Product / UX**  
- **Auction clarity**: Users must understand “best Flicker wins” and countdown; copy and FlickerCountdown placement are critical.  
- **Abuse**: Spam Flickers, fake Lit, harassment. Mitigate: min/max Oil per Flicker, rate limits, block/report, and moderation for Wick Ticket verification (e.g. QR scan logs).

Use this plan as the single source of truth for folder structure, schema, screens, components, real-time, auth, payments, build order, and risks. Start with step 1 of the build order and implement feature-by-feature against the schema and screens above.
