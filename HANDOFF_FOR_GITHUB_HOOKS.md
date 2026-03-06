# Handoff for Claude: GitHub Hooks Setup (Lantern)

Use this when setting up GitHub hooks for the **Lantern** repo.

---

## Project summary
- **Name:** Lantern  
- **What it is:** Mobile dating app (React Native + Expo, Supabase, Stripe).  
- **Repo layout:** Single Expo app in repo root (see `PROJECT_PLAN.md` for full structure).  
- **Tech stack:** Node.js, **Expo (SDK 52+)**, **TypeScript**, **Expo Router**, Supabase client, Stripe (payments).

---

## Relevant for hooks

- **Package manager:** npm (or yarn if `yarn.lock` exists).  
- **Install:** `npm install`  
- **Lint:** Likely ESLint; run `npm run lint` if defined in `package.json`, else `npx expo lint` or `npx eslint .`  
- **Typecheck:** `npx tsc --noEmit` (or `npm run typecheck` if script exists)  
- **Tests:** Add `npm test` / `npm run test` when tests exist; not required for initial hook setup.  
- **Build/export:** `npx expo export` or `eas build` (EAS) for CI; only needed if you’re wiring branch protection or “build on push.”

---

## What to configure (pick what applies)

1. **GitHub Actions (CI)**  
   - On push/PR to `main` (or default branch): `npm ci`, `npm run lint`, `npx tsc --noEmit`.  
   - Optional: run `npx expo export` or `eas build` for a specific branch/tag.

2. **Branch protection**  
   - Require status checks (e.g. “lint”, “typecheck”) before merge if you add those as separate jobs.

3. **Git hooks (Husky / pre-commit, etc.)**  
   - Pre-commit or pre-push: `npm run lint`, `npx tsc --noEmit`.  
   - Repo is Node/Expo; hooks should run in repo root where `package.json` lives.

4. **GitHub webhooks (outgoing)**  
   - If integrating with Supabase, Stripe, or Natively: use repo/organization webhooks; no special repo layout requirements.

---

## Conventions
- **Default branch:** Assume `main` unless the repo uses something else.  
- **Secrets:** No secrets in this doc; use GitHub Secrets (e.g. `SUPABASE_URL`, `STRIPE_SECRET_KEY`) in Actions if needed.  
- **Monorepo:** This is a single app; all commands above are from repo root.

---

## Reference
- Full project plan and schema: `PROJECT_PLAN.md` in this repo.
