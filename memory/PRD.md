# PRD — ELON MUSK × ISLAM (EMI) Microsite

## Original Problem Statement
Premium cinematic philosophical ebook microsite for "ELON MUSK × ISLAM" by Didi Subandi.
Indonesian language. Dark editorial / Netflix documentary aesthetic.
Goals: sell Full Book Rp75K, free Bab 1 read, AI Reflection Assistant chat, WhatsApp lead capture.

## Stack
- Backend: FastAPI + MongoDB (Motor) + Emergent LLM (Claude Sonnet 4.5)
- Frontend: React 19 + React Router 7 + Tailwind + shadcn/ui + sonner + lucide-react
- Fonts: Bebas Neue (heading) · Cormorant Garamond (quote) · Manrope (body)

## User Personas
1. **The Searcher** — feels stuck financially, looking for meaning beyond income (primary buyer)
2. **The Intellectual** — drawn to philosophy + tech intersection (shares & evangelizes)
3. **The Lurker** — reads Bab 1 free, chats with AI, may convert later (lead nurture)

## Core Static Requirements
- Cinematic dark premium UI, brutalist condensed typography
- Mobile-first responsive
- AI Reflection Assistant with strict gatekeeper (only book themes)
- Mock checkout (Midtrans integration deferred)
- Private download tokens for paid orders
- Floating WhatsApp + sticky navbar
- Grain overlay + smooth scroll reveals

## What's Been Implemented (2026-05-25)
**Backend** (`/app/backend/server.py`):
- `POST /api/leads` + `GET /api/leads` + `GET /api/leads/export` (CSV)
- `POST /api/orders` (auto-marks paid for mock flow) + `GET /api/orders/by-token/{token}`
- `GET /api/download/{pdf|epub|flipbook}/{token}` — placeholder text files
- `POST /api/chat` — Claude Sonnet 4.5 via Emergent LLM, strict Indonesian philosophical system prompt
- `GET /api/chat/{session_id}` — history
- `POST /api/track` + `GET /api/stats`

**Frontend**:
- `/` Landing — 11 sections (Hero, Paradoks Anto, Elon, Abdurrahman, AI Reflection, Chapters, Bab1 Preview, Pricing, Marshmallow, Testimonials, Final CTA) + Footer + Floating WA
- `/read/bab-1` — Immersive premium reader for Bab 1 (Paradoks Bayang-Bayang)
- `/checkout` — Mock Midtrans-style form (6 payment methods UI), auto-success
- `/success/:token` — Cinematic ruang-rahasia with download buttons

**Testing**: 17/17 backend pytest pass, 100% frontend flows tested.

## Prioritized Backlog
### P0 — Production blockers (when user is ready)
- [ ] Real Midtrans Snap integration (collect Server Key + Client Key; webhook handler at `/api/payment/callback`)
- [ ] Real PDF/EPUB/Flipbook file storage (Cloudflare R2 or Supabase Storage with signed URLs)
- [ ] Email automation after payment (Resend or SendGrid — cinematic "ritual" template)
- [ ] WhatsApp automation after payment (template message via WA Business API)

### P1 — Enhancements
- [ ] Admin lead dashboard at `/admin/leads` (password-protected)
- [ ] Token expiration on download URLs
- [ ] Idempotency / duplicate email guard on orders
- [ ] Per-chapter purchase (Rp10K) flow
- [ ] Flipbook viewer component

### P2 — Polish
- [ ] Open Graph image generation
- [ ] Newsletter / lead magnet for non-buyers ("kirim Bab 0")
- [ ] Schema.org Book markup
- [ ] Better grain texture using real noise overlay PNG
- [ ] Animated split-screen reveal on Paradoks Anto

## Next Action Items
1. Collect Midtrans keys to wire real payments
2. Upload real ebook files (PDF/EPUB/Flipbook)
3. Decide on email/WA delivery provider
