# CancelWatch v2 — Broaden Scope Beyond Kid Activities

## Problem

v1 solves the notice-period deadline problem for kids' activity memberships
only. The core mechanic (manual entry → computed cancel-by deadline → email
reminders) generalizes to any recurring contract with a cancellation notice
window. Restricting to kid activities caps the addressable market and leaves
the app feeling like a one-day project. This spec broadens the product to
cover a few more high-value categories while keeping the existing
no-login/token-URL model and free-tier stack unchanged.

## Decisions (settled via brainstorming)

| # | Decision | Answer |
|---|----------|--------|
| B1 | Growth axis | Broaden scope (not automation depth, not social/community layer) |
| B2 | Change type | Real new features, not just positioning/copy |
| B3 | Categories for v2 | Gyms/fitness, insurance/utilities/phone plans, storage units/parking/misc contracts. Streaming/software subscriptions explicitly excluded (no notice period, overlaps existing tools like Rocket Money) |
| B4 | Vendor knowledge base | Curated static lookup (not category-only defaults, not crowdsourced) — maintained by the builder, not users |
| B5 | Accounts/schema model | Unchanged — one token per email, multiple membership rows per token (already supported) |

## Non-goals (explicitly deferred)

- OCR/contract parsing
- Crowdsourced or user-editable vendor data
- Streaming/software subscription category
- Native mobile app, SMS/push reminders, password/account system (carried over from v1 non-goals)
- Multi-user/family sharing of a single token

## Data model changes

Add a `category` column to `memberships`:

```sql
alter table memberships
  add column category text not null default 'kid_activity';

-- allowed values enforced at the app layer (see add-membership.ts):
-- 'kid_activity' | 'gym' | 'insurance_utility' | 'storage_misc'
```

- Existing rows backfill to `'kid_activity'` via the column default — no
  backfill script needed.
- `activity_name`, `start_date`, `cycle_days`, `notice_days`, `next_deadline`
  are unchanged. No breaking change to `add-membership.ts`'s deadline math or
  `cron-plan.ts`.
- Validation: `add-membership.ts` rejects any `category` not in the fixed
  four-value set.

## Vendor knowledge base

New file `src/lib/vendor-hints.ts`, a static in-memory list, grouped by
category:

```ts
type VendorHint = {
  name: string;
  aliases: string[];
  category: Category;
  cycleDays: number;
  noticeDays: number;
};
```

- ~10–15 curated entries per new category (gym chains like Planet Fitness,
  LA Fitness; insurers/utilities like State Farm, Geico; storage chains like
  Public Storage, Extra Space). Kid activities category stays without a
  seed list (v1 behavior — always freeform).
- No database table, no admin UI. Extending the list means editing this
  file and redeploying — acceptable given the free-tier, no-budget
  constraint and that this is a builder-maintained curation, not
  user-generated data.
- A lookup/matching function (`findVendorHint(category, query): VendorHint | null`)
  does case-insensitive substring matching against `name` and `aliases`.

## Form UX changes

`membership-form.tsx`:

1. Category selector (radio or select) is the first field, one of the four
   values. Defaults to no selection — user must pick.
2. Activity-name field becomes a typeahead scoped to the selected category's
   hint list (client-side filter over the static list — no API call
   needed since the list is small and bundled).
3. Selecting a suggested vendor prefills `cycle_days` and `notice_days`;
   both remain editable inputs, not locked.
4. Freeform entry (no match) still works exactly as v1 — user types
   whatever they want and fills in cycle/notice days manually.

No changes to the dashboard list view (`m/[token]/page.tsx`) beyond
optionally showing the category next to each entry — cosmetic, low
priority, can be a small follow-up inside the same implementation pass.

## Copy / positioning changes

- Landing page (`app/page.tsx`) copy shifts from "kid activity
  memberships" framing to "any membership or contract with a cancellation
  notice window" — kid activities becomes one example among several, not
  the headline.
- GTM plan (from `HANDOFF.md`) expands promotion channels per new
  category: r/personalfinance and gym-focused subreddits for
  gyms/fitness; general consumer-advocacy or insurance-focused
  communities for insurance/utilities. Existing parent-group channel for
  kid activities is kept, not replaced.

## Testing

- `vendor-hints.test.ts`: matching function returns correct hint for exact
  name, alias, case-insensitive partial match, and `null` for no match.
- `add-membership.test.ts` (existing file, extended): rejects invalid
  `category` values; accepts all four valid values; deadline math
  unaffected by category.
- Existing test suite (`deadline.test.ts`, `days-remaining.test.ts`,
  `cron-plan.test.ts`, `token.test.ts`) requires no changes — none of them
  touch `category`.

## Rollout

Single migration + deploy, no phased rollout needed — the new category
values and vendor hints ship together, kid-activity flow is unaffected
during and after the change (default value keeps old rows valid, existing
freeform entry path is untouched for any category).
