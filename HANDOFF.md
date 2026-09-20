# CancelWatch — Handoff

## Problem (validated)

Kids' activity memberships (gymnastics, swim, karate, dance, gyms) commonly use
fixed-term contracts requiring written cancellation notice (often 28 days, or
10 working days) before the next billing date. Parents forget, or the kid
quits/outgrows the activity, and get charged anyway. This is a documented,
systemic pattern (Reddit: "flat out predatory"), not an isolated anecdote.
Families lose ~$200–1,080/yr to forgotten recurring charges generally (FTC
complaints on this rose from 42/day in 2021 to 70/day in 2024).

Existing subscription trackers (Rocket Money, Bobby) require bank-account
linking and target general subscriptions, not this specific notice-period
problem. Gap is real.

## Product decisions (settled via grilling)

| # | Decision | Answer |
|---|----------|--------|
| Q1 | Core wedge | Deadline guard only (not "outgrown detector") — alert before cancellation notice window closes |
| Q2 | Data entry | Fully manual (no OCR/contract parsing in v1) |
| Q3 | Platform | Web app, mobile-friendly. No native app, no App Store |
| Q4/Q6 | Build order | Build simple working v1 first, then promote (resume-driven; skip pure landing-page-only validation) |
| Q7/Q8 | Promotion | Facebook parent groups / r/Parenting — post as a genuine pain-point question, link only in replies (avoids spam-moderation) |
| Q10 | Success signal | Not just signup count — a few unprompted replies describing their own real membership/deadline story is the real green light |
| Q11 | Reminder channel | Email only (no SMS, no push) |
| Q12/Q13 | Accounts | No signup/password. Enter email → immediately get a private token URL (bookmark it). Email itself is only used later to send reminders, no login-email round trip |
| Q14 | Deadline entry | User enters: start date, renewal cycle, notice-period days. App computes the cancel-by deadline (not typed directly) |
| Q15 | Reminder cadence | Two emails per deadline: 3 days before, and 1 day before |
| Q17 | Recurrence | After a deadline passes uncanceled, entry auto-rolls forward to the next cycle and keeps reminding, until user deletes/marks it canceled |

## Stack (free tier, no budget)

- **Next.js** — app + API routes
- **Supabase** (Postgres) — data store: memberships table keyed by owner email/token
- **Resend** — transactional email for reminders
- **Vercel** — hosting + Vercel Cron (daily job checks upcoming deadlines, sends the 3-day/1-day emails)

## Data model (v1, minimal)

```
memberships
  id            uuid pk
  token         text (unique, in the URL, no login)
  email         text
  activity_name text
  start_date    date
  cycle_days    int      -- e.g. 30 (monthly) or 365 (annual)
  notice_days   int       -- e.g. 28
  next_deadline date      -- computed: start_date + cycle_days - notice_days, then rolled forward
  canceled_at   timestamp nullable
  created_at    timestamp
```

Daily cron: for each row where canceled_at is null and next_deadline is in
{today+3, today+1}, send reminder email. When next_deadline passes uncanceled,
roll next_deadline forward by cycle_days.

## Not in v1 (explicitly deferred)

- OCR/contract parsing
- Native mobile app
- SMS reminders
- Password/account system
- Bank-account linking
- "Outgrown activity" detection

## Go-to-market plan

1. Build v1 end to end, test on a real membership.
2. Post in 2–3 local/parent Facebook groups and r/Parenting as a question
   about the pain point (not a pitch), link the tool in replies once people
   engage.
3. Watch for qualitative signal (people describing their own story), not just
   raw signups.

## Next step

Hand this file to `writing-plans` / normal TDD implementation flow to build
the Next.js app per the data model above.
