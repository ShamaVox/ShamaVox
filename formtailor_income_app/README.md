# FormTailor (Next.js + Supabase + Stripe)

An AI‑assisted intake forms app for therapists, coaches, and boutique clinics.
- Build forms.
- Collect submissions via shareable links.
- Auto‑generate first‑draft session notes + next‑steps from responses.
- Subscription‑gated (Stripe).

> ⚠️ Not medical advice; **not HIPAA compliant** out of the box. See the **Security & Privacy** section for posture and where to add BAAs, logging, and PHI handling.

## Quick Start

1. **Clone & install**
```bash
pnpm i   # or npm i / yarn
cp .env.example .env
```

2. **Create Supabase project** → paste `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
   - Also paste `SUPABASE_SERVICE_ROLE_KEY` (server use only).

3. **Apply schema & RLS policies** (from `supabase/schema.sql`).
   - In Supabase SQL editor, run the entire file.

4. **Stripe**
   - Create a product + recurring price, put its id in `STRIPE_PRICE_ID`.
   - Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`.
   - In Stripe dashboard → Webhooks → point to `http://localhost:3000/api/stripe/webhook`.

5. **OpenAI**
   - Put `OPENAI_API_KEY` in `.env` (or leave blank to disable notes generation).

6. **Run**
```bash
npm run dev
```

7. Visit `http://localhost:3000` → Sign in with Supabase Auth (email magic link).

---

## Security & Privacy Posture (starter)
- Row Level Security (RLS) ON for all PHI‑like tables.
- Minimal PII stored; **masked_fields** support with optional `ENCRYPTION_KEY`.
- No logs of raw responses in server console.
- Add **BAA** with vendors and harden:
  - Turn on Supabase logs redaction
  - Create private S3 bucket for uploads
  - Rotate keys; use KMS/HSM if handling PHI
  - Add audit trails (basic version included)

## Tech
- **Next.js 14 App Router**, TypeScript, Tailwind
- **Supabase** (Auth + Postgres + RLS)
- **Stripe** (Subscriptions)
- **OpenAI** (draft notes generation)

## Deploy
- Vercel + Supabase + Stripe recommended.
- Set env vars in Vercel Dashboard; add your Stripe webhook there too.

## Folders
- `app/` routes (public pages, dashboard, API endpoints)
- `components/` UI modules (FormBuilder, FormRenderer, Navbar)
- `lib/` clients (supabase, stripe, crypto), helpers
- `supabase/` schema + policies

**Enjoy!**
