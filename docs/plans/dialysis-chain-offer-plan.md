# Dialysis Chain Offer Plan

Date: 2026-02-21
Market: Malaysia
Target customer: Dialysis groups with multiple branches

## 1) Analytics Baseline (GA4)

Property used: `469818591` (`Dialisis MY`)
Date range for baseline: 2026-01-22 to 2026-02-20

- Total users: 4,937
- Sessions: 5,972
- Engaged sessions: 2,772
- Engagement rate: 46.4%
- Page views: 10,943

Previous 30-day comparison (2025-12-23 to 2026-01-21):
- Users: 4,434 -> 4,937 (+11.3%)
- Sessions: 5,528 -> 5,972 (+8.0%)
- Page views: 9,744 -> 10,943 (+12.3%)

Traffic profile:
- Organic Search: 4,770 sessions (79.9%)
- Direct: 1,217 sessions (20.4%), low engagement (8.2%)
- Mobile: 3,572 sessions (59.8%)

Top landing pages by sessions:
- `/` (77)
- `/lokasi/terengganu/kuala-terengganu` (38)
- `/lokasi/kelantan/kota-bharu` (31)
- `/lokasi/kedah/langkawi` (29)
- `/lokasi/pahang/kuantan` (29)

Lead tracking gap:
- `form_start`: 20 events from 4 users
- Form starts only detected on `/`
- No `form_submit` or `generate_lead` event in GA4

## 2) What You Sell

### Core outcomes

- Fill more dialysis chairs per branch.
- Increase trust and preference for the chain brand.
- Standardize branch information across all pages.

### Offer A: Chain Profile + Branch Pages

- One master profile page for the chain.
- One detailed page per branch.
- Standard content blocks on each branch page:
- Operating hours
- Images
- Location map widget
- Services and facilities
- Contact CTA (call + WhatsApp + form)
- FAQ section

### Offer B: Pilihan Utama Placement

- `Pilihan Utama` badge on selected branches.
- Priority ranking on directory search/category pages.
- Featured placement can be set by city/state priority.

### Offer C: Verified Operator Badge

- Badge at chain and branch level after verification.
- Verification checks:
- SSM business entity
- Branch contact validity
- Basic service completeness

### Offer D: Lead Program (Qualified Leads)

- Patient-family inquiry capture and qualification.
- Lead sent to nearest or selected branch.
- Response-time tracking and reporting.

Data-backed priority:
- Sell to chains with strong branches in cities that already have demand pages.
- Push `Pilihan Utama` first on high-intent location pages before broad sitewide upsell.
- Sell lead program only after conversion tracking is fixed.

## 3) Product Packages

## Starter (Visibility)

- Price: RM690/month
- Includes:
- Up to 10 branch pages
- Chain profile page
- Standard branch info blocks
- Monthly profile performance report

## Growth (Visibility + Leads)

- Price: RM1,500/month + lead credits
- Includes:
- Everything in Starter
- `Pilihan Utama` for up to 5 branches
- Lead capture forms on pages
- Lead routing to branch WhatsApp/email
- Basic lead dashboard

## Enterprise (Network Performance)

- Price: RM3,900/month
- Includes:
- Everything in Growth
- Unlimited branches
- SLA response tracking
- Quarterly optimization review
- HQ dashboard by branch/state

## Lead credit pricing

- RM60 per qualified lead (standard).
- RM90 per qualified lead (urgent start needed in 14 days).
- Replacement credit for invalid leads.

## 4) Definition of Qualified Lead

A lead is qualified when all items below are true:

- Real contact name and reachable phone.
- Looking for dialysis center in Malaysia.
- Has treatment need timeline (now, within 14 days, within 30 days).
- Has location preference (city or state).
- Has explicit consent to be contacted.

Invalid lead replacement rules:

- Number unreachable after 3 contact attempts within 48 hours.
- Duplicate lead submitted within 30 days.
- Spam/non-healthcare intent.

## 5) Sales Assets You Need

Create these before active selling:

- One-page PDF service sheet with package comparison.
- 2 demo pages:
- One chain profile demo
- One branch page demo
- Lead flow screenshot from form to branch notification.
- Pricing and SLA document.
- Standard MSA + order form template.

## 6) Internal SOP (Simple Version)

### Daily

- Check new leads at 9:00, 13:00, 17:00.
- Verify invalid lead claims.
- Send lead summary to each client branch contact.

### Weekly

- Send branch-level report:
- Leads received
- Qualified leads
- Response time
- Top pages by traffic

### Monthly

- Run page data quality check for each chain.
- Propose one optimization:
- Better FAQ
- Better images
- Updated hours/holiday schedule

## 7) Implementation Backlog (4 Weeks)

### Week 1

- Finalize package names, pricing, qualified-lead definition.
- Prepare sales deck and one-page PDF.
- Build chain profile template block list.
- Fix measurement foundation:
- Set `form_submit`, `whatsapp_click`, `phone_click`, `map_click` as events.
- Mark `form_submit` and `whatsapp_click` as key events in GA4.
- Keep only one active GA property for reporting (`469818591`).

### Week 2

- Add branch-level FAQ module and schema-ready FAQ block.
- Add lead form fields needed for qualification.
- Add branch lead routing rules.

### Week 3

- Build basic reporting table:
- Leads by branch
- Response time
- Qualified rate
- Build invalid lead replacement workflow.

### Week 4

- Pilot with 1 chain client.
- Measure first month baseline:
- Cost per qualified lead
- Branch response time
- Booking conversion

## 8) Success Metrics (First 90 Days)

- Close 3 chain accounts.
- Reach 150 qualified leads total.
- Keep invalid lead rate under 15%.
- Keep median first response time under 15 minutes.
- Reach at least 20% lead-to-visit conversion (client-reported).
- Reach tracked session-to-lead rate >= 0.8% after instrumentation is live.
