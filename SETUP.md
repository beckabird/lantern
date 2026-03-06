# Lantern — Setup Guide

This guide walks you through connecting the app to a real Supabase project with seed data.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the project to finish provisioning.

---

## 2. Run the database migration

1. In your Supabase dashboard, go to **SQL Editor**.
2. Open `supabase/migrations/001_schema.sql` from this repo.
3. Paste its contents into the SQL Editor and click **Run**.

This creates the following tables and sets up RLS + the `place_bid_atomic` RPC:

| Table | Description |
|-------|-------------|
| `profiles` | One row per auth user. Stores `username`, `wicks_balance`, `city`, `bio`. |
| `auctions` | Items being auctioned. Linked to a `host_id` (profiles) and optional `winner_id`. |
| `bids` | Individual bids. Linked to `auction_id` and `bidder_id` (profiles). |
| `wick_transactions` | Ledger of all wicks credits/debits (bid placed, bid refunded, purchase, etc.). |

---

## 3. Set environment variables

Create a `.env` file in the repo root (same level as `package.json`):

```
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Find your keys in **Project Settings → API**:
- **URL** → `EXPO_PUBLIC_SUPABASE_URL`
- **anon / public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(only needed for seeding — keep this secret)*

> **Note:** The `.env` file is git-ignored. Never commit your service role key.

---

## 4. Install dependencies and run the seed

```bash
npm install
npm run seed
```

The seed script creates:

| What | Details |
|------|---------|
| 5 auth users | `maya@lantern.demo`, `james@lantern.demo`, `priya@lantern.demo`, `leo@lantern.demo`, `dana@lantern.demo` — all with password **`demo1234`** |
| 5 profiles | Matching profiles, each starting with **50 wicks**. |
| 8 auctions | Mix of active (ends in future) and ended auctions, across vibes: vintage, music, food, plants, experience, photography, art. |
| Sample bids | A few bids on the active auctions using the `place_bid_atomic` RPC (handles refunds and balance deduction atomically). |

The seed is **idempotent** — safe to run multiple times; existing users/auctions are reused.

---

## 5. Start the app

```bash
npm start
```

Log in with any of the demo accounts, e.g.:

```
Email:    maya@lantern.demo
Password: demo1234
```

---

## What works out of the box

| Feature | Status |
|---------|--------|
| Auth (sign up / sign in / sign out) | ✅ |
| Profile auto-creation on first sign-in | ✅ |
| Auction feed | ✅ |
| Auction detail | ✅ |
| Place bid (atomic — deducts wicks, refunds outbid user) | ✅ |
| Create auction | ✅ |
| Wick store (purchase wicks) | ✅ |
| Profile screen | ✅ |
| Realtime bid updates | ✅ |

## What's left for you to implement

| Feature | Notes |
|---------|-------|
| End auction / declare winner | Set `winner_id` on the auction and credit the host. Run via SQL or schedule with a cron/Edge Function. |
| Push notifications | Wire Supabase Realtime or Edge Functions to send push via Expo. |
| Payment processing | Integrate Stripe to top up wicks balance. |

---

## Architecture notes

### Snake_case ↔ camelCase

The Supabase DB uses `snake_case` column names. The app uses `camelCase` throughout.
Conversion happens in `src/lib/mapSupabase.ts`:

- `mapProfile(row)` → `Profile`
- `mapAuction(row)` → `Auction` (includes nested `host` and `winner` profiles)
- `mapBid(row)` → `Bid` (includes nested `bidder` profile)
- `profileToRow(update)` → converts a camelCase update back to snake_case for DB writes

### Hooks

| Hook | File | What it does |
|------|------|--------------|
| `useProfile` | `src/hooks/useProfile.ts` | Fetches the signed-in user's profile; auto-creates one on first login. |
| `useAuctions` | `src/hooks/useAuctions.ts` | Lists all auctions with realtime updates. |
| `useAuction` | `src/hooks/useAuction.ts` | Fetches a single auction with realtime updates. |
| `useBids` | `src/hooks/useBids.ts` | Lists bids for an auction with realtime INSERT subscription. |

### place_bid_atomic RPC

Call it with:

```typescript
const { error } = await supabase.rpc("place_bid_atomic", {
  p_auction_id: auctionId,
  p_bidder_id: userId,
  p_amount: amount,
});
```

The RPC atomically:
1. Validates the auction is still open and the bid beats the current high.
2. Checks the bidder has enough wicks.
3. Refunds the previous high bidder.
4. Deducts wicks from the new bidder.
5. Inserts the bid and updates `auctions.current_bid`.
6. Records `wick_transactions` entries for the debit and the refund.
