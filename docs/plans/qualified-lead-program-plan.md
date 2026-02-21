# Qualified Lead Program Plan

Date: 2026-02-21
Program owner: Dialisis.my
Audience: Multi-branch dialysis operators in Malaysia

## 1) Program Goal

Build a lead product that chain operators trust and renew:

- Predictable volume of qualified inquiries.
- Fast branch assignment.
- Transparent reporting.

## 2) Data Context (2026-01-22 to 2026-02-20)

GA4 property: `469818591`

- Users: 4,937
- Sessions: 5,972
- `form_start`: 20
- Users with `form_start`: 4
- Form starts currently detected only on homepage (`/`)

Current problem:
- Lead intent exists, but conversion tracking is incomplete.
- No `form_submit` key event in GA4, so paid lead reporting is not reliable yet.

## 3) Lead Funnel Design

### Funnel stages

1. Visitor lands on chain or branch page.
2. Visitor submits lead form.
3. System auto-scores lead completeness.
4. Lead routed to best-fit branch.
5. Branch acknowledges and contacts lead.
6. Lead status updated (contacted/booked/not qualified).

### Required form fields

- Full name
- Mobile number
- Preferred location (state/city)
- Treatment timeline (now / 14 days / 30 days)
- Current dialysis status (new / transfer / helping family)
- Preferred contact channel (call / WhatsApp)
- Consent checkbox

## 4) Qualification Rules

### Auto-qualification scoring

- +30 phone number valid format
- +20 timeline selected
- +20 location selected
- +20 intent confirms dialysis need
- +10 consent checked

Qualified threshold:

- Score >= 80 is qualified lead.

Disqualified rules:

- Score < 80
- Duplicate within 30 days
- Invalid or unreachable phone

## 5) Lead Routing Rules

Default routing:

1. Match lead location to same city branches.
2. If no city match, route to same state nearest branch.
3. If no branch available, route to chain HQ contact.

Priority routing:

1. `Pilihan Utama` branch gets first route if location match exists.
2. If no response in 10 minutes, fallback to second nearest branch.

## 6) SLA and Operational Rules

### SLA targets

- First response target: under 10 minutes.
- Contact attempt window: within 2 hours.
- Minimum attempts before marking unreachable: 3 attempts in 48 hours.

### Failure handling

- If no first response within SLA, trigger backup route.
- If lead invalid, mark with reason code and submit for replacement review.

Reason codes:

- Invalid number
- Duplicate
- Out-of-service area
- Non-dialysis inquiry

## 7) Dashboard and Reporting

### Client-facing metrics

- Total leads
- Qualified leads
- Qualification rate
- First response time (median)
- Contacted rate
- Booked visit rate
- Invalid lead rate

### Internal QA metrics

- Lead replacement ratio
- Branch compliance with SLA
- Drop-off by form field
- Session-to-lead rate
- Page-to-lead rate by top location pages

## 8) Commercial Terms

### Recommended initial pricing

- RM60 per qualified lead
- RM90 urgent qualified lead (timeline <= 14 days)

### Billing model

- Monthly invoice + lead detail report.
- Include lead ID, timestamp, branch routed, and status.

### Replacement policy

- Full replacement credit for validated invalid leads.
- Claim window: 7 days from lead delivery.

## 9) Execution Checklist

### Setup checklist

- Create lead form on chain and branch pages.
- Add scoring and qualification logic.
- Add routing rules by location.
- Add WhatsApp/email delivery per branch.
- Add status update fields in dashboard.
- Add GA4 events:
- `lead_form_start`
- `lead_form_submit`
- `lead_whatsapp_click`
- `lead_phone_click`
- Mark `lead_form_submit` and `lead_whatsapp_click` as key events.

### QA checklist

- Submit 20 test leads across 5 states.
- Validate route accuracy for each test lead.
- Validate fallback routing after no response.
- Validate replacement credit workflow.
- Validate GA4 event counts vs backend lead records daily.

### Pilot checklist

- Run 30-day pilot with 1 chain client.
- Track baseline by branch.
- Adjust score threshold only once after week 2.

## 10) 30-Day Pilot Targets

- 50 total leads.
- 35 qualified leads minimum.
- Median response time under 15 minutes.
- Invalid rate under 15%.
- One renewal conversation booked by day 25.
- Session-to-lead rate target: 0.8% or higher.
