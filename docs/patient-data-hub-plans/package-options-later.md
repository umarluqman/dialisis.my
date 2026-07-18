# Package Options (Later)

Date: 2026-02-24
Status: Deferred until after pilot validation

## 0) Monetization Direction (Already Decided)

The broad monetization direction is clear even if pricing is deferred:

- Patient-side value leads adoption.
- Center-side subscription is how `dialysis.my` makes money.
- Centers subscribe to access digital patient handoff data and center management tools.
- Non-subscribed centers may receive limited patient-authorized transfer access (time-limited read-only), but not full workflow access.

What is deferred:

- Final package names
- Exact pricing
- Usage limits and billing rules

## 1) Why We Are Deferring Packaging

Right now the highest-value work is proving that `dialysis.my` reduces manual intake and handoff friction.

Pricing too early creates risk:

- We may price the wrong unit of value.
- We may package features before the workflow is stable.
- We may sell promises before operational results are proven.

## 2) What Must Be True Before Pricing

Define packages only after the pilot can show:

- Clear time saved for nurse/admin workflow
- Better data completeness vs current process
- Reliable handoff process with low failure rate
- Repeatable intake field set (not changing weekly)
- One center willing to continue after pilot
- Centers understand and accept the value of subscription-gated data access

## 3) Likely Packaging Directions To Test Later

These are options to evaluate, not final offers.

### Option A: Center subscription (recommended base model)

- Fixed monthly fee per center
- Includes:
  - Digital patient handoff/case access
  - Intake coordination workflow
  - Basic reporting
  - Center profile editor (images/info/updates)
  - `Verified` badge eligibility

Best when:

- Centers care about operational efficiency more than lead volume
- You want predictable revenue and clear entitlement boundaries

Boundary to preserve:

- Subscription should clearly unlock workflow convenience and ongoing operational access, while patient-authorized one-off transfer sharing remains possible for non-subscribed centers.

Reference:

- `docs/patient-data-hub-plans/non-subscribed-center-contact-verification-v1.md`

### Option B: Per active patient intake / case

- Pay per completed intake packet or successful handoff

Best when:

- Usage varies and centers prefer variable cost

### Option C: Hybrid (setup + monthly + usage)

- Setup fee for onboarding/template setup
- Monthly platform fee
- Usage-based fee above a threshold

Best when:

- There is real onboarding work and ongoing support
- You need to support both single centers and larger chains

### Option D: Multi-branch network plan (later)

- HQ dashboard + branch-level workflow coordination
- Priced by branch count or monthly intake volume

Best when:

- Single-center workflow is already proven

## 3A) `Verified` Badge Positioning (Replaces `Pilihan Utama`)

Use `Verified` as the trust label in patient-facing experiences.

- `Verified` should communicate objective checks passed.
- `Verified` should not imply ranking favoritism.
- If paid promotion is introduced later, use a separate label such as `Sponsored`.

Suggested early `Verified` checks:

- Center identity/business verification
- Contact channel verification
- Basic center information completeness
- Service information completeness
- Agreement to receive and respond to digital patient handoffs

Reference:

- `docs/patient-data-hub-plans/verified-badge-criteria-v1.md`

## 4) Data To Collect During Pilot (for Pricing Decisions)

- Average submissions per week
- Average review time per submission
- Missing info follow-up rate
- Time from submission to center-ready handoff
- Support time per center staff member
- Center feedback on most valuable parts of the workflow
- Willingness-to-pay signals (qualitative)
- Interest in `Verified` badge and profile editor usage

## 5) Pricing Decision Checkpoint

Run a pricing/package decision session after:

- At least 30-50 real submissions processed, or
- 4-8 weeks of pilot usage with one center (whichever comes first)

Output from that session:

- Chosen value metric
- Draft package structure
- Pilot-to-paid conversion offer
- What stays manual vs what becomes productized
- Final entitlement list for subscribed centers (data access, editor, `Verified`)

## 6) What We Can Prepare Now (Without Pricing)

- Track pilot metrics cleanly
- Document SOP for intake review and handoff
- Record repeat pain points and time sinks
- Keep notes on buyer objections and staff feedback
- Draft `Verified` criteria checklist and review process
- Define what features are free (patient-facing) vs subscription-gated (center-facing)

This will make the later package design faster and more defensible.
