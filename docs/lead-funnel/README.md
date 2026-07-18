# Lead Funnel Plan

Date: 2026-07-03
Primary target page: Shah Alam city page

## Recommendation

Run Shah Alam as a 30-day lead pilot, not a full paid lead product yet.

Reason:

- Six-month Shah Alam demand exists: 1,250 views, 629 users.
- Sitewide intent exists: 812 users clicked phone links, 561 clicked map links.
- But GA has 0 key events and no visible `lead_form_submit`.

## Funnel

1. User lands on Shah Alam city page.
2. Show a low-friction lead prompt after intent, not immediately.
3. User submits minimal lead form.
4. System scores lead.
5. System routes lead to best-fit center.
6. Center receives WhatsApp/email handoff.
7. Lead status gets tracked: sent, accepted, contacted, booked, rejected.

## Popup Rules

Use a mobile bottom sheet, desktop modal.

Trigger only after one of these:

- 20s on page.
- 50% scroll.
- User clicks map/phone/center card.
- User returns to Shah Alam page in same session.

Do not ask for MyKad, full address, or lab result in first popup. That is too heavy and too sensitive for lead capture. Ask for those later only after user chooses/accepts a center flow.

First popup fields:

- Name
- Phone
- Patient or family member
- Current status: new dialysis, transfer, emergency/urgent, just researching
- Preferred area in Shah Alam
- Preferred contact: WhatsApp/call
- Consent to send details to selected nearby center

## Lead Qualification

Qualified lead threshold: 80+.

Score:

- Phone valid: +20
- Shah Alam or nearby location: +20
- Timeline selected: +20
- Dialysis intent selected: +20
- Contact preference selected: +10
- Consent checked: +10

Reject or hold:

- No consent
- Invalid phone
- Duplicate in 30 days
- Non-dialysis inquiry
- User only wants general directory info

## Center Routing

Default:

1. If user selected a center, route there.
2. If city page lead, rank centers by score.
3. If top center misses SLA, fallback to next center.

Center score:

- Same city/nearby area: +25
- Service fit: +20
- Verified contact: +15
- Available slot/capacity confirmed: +15
- Fast response history: +15
- Paid/partner center: +10

Hard blocks:

- Unverified phone/email.
- No lead agreement.
- No consent to send patient details.
- Center repeatedly misses SLA.

## First Partner Offer

Sell a pilot, not guaranteed volume.

Offer:

- 30-day Shah Alam lead pilot.
- Pay only for qualified leads.
- Suggested price: RM60 qualified lead, RM90 urgent lead.
- Include lead replacement for invalid number/duplicate/out-of-area.
- Include weekly report: leads sent, contacted, booked, invalid.

Positioning:

> Dialisis.my already receives Shah Alam dialysis search traffic. We can route qualified patient inquiries to nearby centers with response tracking.

## Must Fix Before Selling

- Mark `lead_form_submit`, `lead_phone_click`, `lead_whatsapp_click`, and `search_submit` as GA key events.
- Confirm `lead_form_submit` fires in GA.
- Store source page, center, city, route decision, and lead status in backend.
- Add explicit consent copy for sending details to a selected/partner dialysis center.
- Build center response SLA tracking.

## Pilot Success Target

30 days:

- 8-15 qualified Shah Alam leads.
- 70% contacted within 2 hours.
- 40% accepted by center.
- Invalid rate under 15%.
- At least 1 paying center renewal conversation.

