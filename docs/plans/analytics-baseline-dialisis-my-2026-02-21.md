# Dialisis.my Analytics Baseline

Snapshot date: 2026-02-21
Primary property: `469818591` (`Dialisis MY`)
Secondary property with no data: `469874815`

## Date Window

- Last 30 days: 2026-01-22 to 2026-02-20
- Previous 30 days: 2025-12-23 to 2026-01-21

## Core Metrics

Last 30 days:
- Users: 4,937
- Sessions: 5,972
- Engaged sessions: 2,772
- Engagement rate: 46.4%
- Page views: 10,943

Trend vs previous 30 days:
- Users: +11.3% (4,434 -> 4,937)
- Sessions: +8.0% (5,528 -> 5,972)
- Engaged sessions: +4.1% (2,663 -> 2,772)
- Page views: +12.3% (9,744 -> 10,943)

## Acquisition Mix

- Organic Search: 4,770 sessions (79.9%)
- Direct: 1,217 sessions (20.4%)
- Unassigned: 27 sessions
- Referral + Organic Social: 18 sessions combined

Top sources:
- `google / organic`: 4,538 sessions
- `(direct) / (none)`: 1,217 sessions
- `bing / organic`: 153 sessions

## Device Mix

- Mobile: 3,572 sessions (59.8%)
- Desktop: 2,377 sessions (39.8%)
- Tablet: 24 sessions

## Landing Pages (Top)

- `/` : 77 sessions
- `/lokasi/terengganu/kuala-terengganu` : 38 sessions
- `/lokasi/kelantan/kota-bharu` : 31 sessions
- `/lokasi/kedah/langkawi` : 29 sessions
- `/lokasi/pahang/kuantan` : 29 sessions

## Event Tracking Status

Tracked events seen:
- `page_view`
- `session_start`
- `first_visit`
- `user_engagement`
- `click`
- `scroll`
- `form_start`

Conversion tracking gap:
- `form_start`: 20 events from 4 users
- `form_start` only detected on `/`
- No `form_submit` or `generate_lead` event found

## Action Priority

1. Consolidate reporting to property `469818591`.
2. Instrument lead events (`search_submit`, `lead_whatsapp_click`, `lead_phone_click`).
3. Mark submit/click lead events as key events in GA4.
4. Optimize CTA and form UX on top location pages, not only homepage.
