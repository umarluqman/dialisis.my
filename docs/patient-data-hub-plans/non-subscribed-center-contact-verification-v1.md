# Non-Subscribed Center Contact + Verification Flow (v1)

Date: 2026-02-24
Status: Draft for pilot use
Scope: Patient-authorized transfer packet sharing to a non-subscribed center

## 1) Purpose

Handle patient transfer safely and quickly when the receiving dialysis center is not subscribed, while preserving a clear upgrade path to a paid center subscription.

Principles:

- Do not block patient transfer.
- Share only after explicit patient consent.
- Verify recipient contact before sharing sensitive data.
- Keep access limited, read-only, and time-limited.

## 2) Who To Contact First

Primary contact order (use the first available verified channel):

1. Dialysis center nurse/coordinator (receiving intake/transfers)
2. Branch admin/front desk (if nurse/coordinator is unavailable)
3. Branch manager

Do not send patient details to:

- Generic public numbers/emails without confirming the recipient role
- Personal contacts not linked to the center
- Third-party agents not authorized by the center

## 3) Minimum Verification Before Sharing

Verify all 3 before sending access:

- Center identity: confirm the branch name/location matches the patient's intended center
- Recipient role: confirm the person handles intake/transfers (or is authorized to receive patient transfer data)
- Contact ownership: verify the phone/email belongs to that center/staff member

Acceptable proof (v1, simple):

- Recipient confirms official center name + branch location + role on call
- Reply from official center email domain (if available)
- Callback to publicly listed center number and transfer confirmation
- Cross-check with center contact listed on `dialysis.my` (if already in directory)

Pilot minimum verification standard (chosen):

- Use one trusted-channel verification before sharing:
  - Preferred: callback to a publicly listed center number (or already-verified `dialysis.my` directory number) confirming branch + recipient role
  - Alternative: reply from an official center email domain confirming branch + recipient role
- If neither can be completed, do not send center access link; use patient fallback summary flow instead

## 4) Contact Flow (v1 SOP)

### Step 1: Confirm patient consent and target center

Before contacting the center:

- Patient selects target center
- Patient gives explicit consent to share data with that center
- `dialysis.my` records consent timestamp and submitter identity

### Step 2: First outreach to center (notification only)

Goal:

- Inform the center that a patient-authorized transfer packet is available
- Ask for the correct receiving contact
- Do not expose sensitive details yet

Information allowed in first outreach:

- `dialysis.my` identity
- Statement that a patient has authorized transfer packet sharing
- Request for the correct intake/transfers contact
- Next step (verification required before access)

Do not include:

- Full patient medical details
- IC/passport number
- Detailed diagnosis/medication information

Pilot outreach channel defaults (chosen):

- Allowed channels for first outreach: phone call, WhatsApp, official email
- Preferred order:
  1. Phone call (during business hours)
  2. WhatsApp to verified/center-linked number
  3. Official email (if available)
- Plain-text patient medical details are not sent over phone/WhatsApp/email; use secure link after verification

### Step 3: Verify receiving contact

Use one of these methods:

- Phone verification call + callback
- Email verification reply from center email
- Branch-listed contact confirmation

Record:

- Verifier name
- Role
- Verified contact channel
- Time/date
- Verification method used

### Step 4: Send secure read-only access

After verification:

- Generate time-limited read-only link
- Link should be one-time use or short expiry
- Require minimal access check (OTP or email confirmation if available)
- Show transfer packet in read-only mode

### Step 5: Follow-up and fallback

If center views packet:

- Log view + timestamp
- Ask if they need clarification/missing items

If center does not respond or refuses:

- Patient can download/share transfer-ready summary (PDF/web summary)
- Log non-response/decline

## 5) Suggested Outreach Scripts (v1)

### A) First phone script (notification + contact routing)

Hi, this is `[name]` from `dialysis.my`.

A patient has authorized us to share a transfer/intake packet with your center. We need the correct nurse/coordinator or authorized staff contact who handles dialysis intake/transfers.

Before we share anything, we verify the recipient contact and then provide a secure read-only access link.

Who is the best person to receive this?

### B) First WhatsApp/SMS script (short)

Hi, this is `dialysis.my`. A patient has authorized a dialysis transfer/intake packet for your center. Please reply with the authorized nurse/coordinator contact (name + role) to receive a secure read-only access link after verification.

### C) Email script (verification request)

Subject: Patient-authorized transfer packet available via `dialysis.my` (verification required)

Hello,

`dialysis.my` has a patient-authorized dialysis transfer/intake packet intended for `[center name / branch]`.

Please confirm:

- Your name
- Role (nurse/coordinator/admin)
- Branch name/location
- Preferred email/phone for secure access

After verification, we will send a time-limited read-only access link.

## 6) Access Rules for Non-Subscribed Centers (v1)

Allowed:

- Read-only packet viewing
- Single-packet access
- Time-limited access

Not allowed:

- Ongoing center inbox/case queue
- Multi-user/team access
- Historical packet archive
- Editing/acknowledgment workflow in platform
- Center profile editor
- `Verified` badge eligibility

## 7) Time Limits and Retry Rules (v1)

Recommended defaults:

- First outreach attempt: within 2 hours of packet readiness (business hours)
- Follow-up attempts: up to 3 attempts in 48 hours
- Read-only link expiry: 48 hours
- Reissue link: allowed after re-verification if expired

Reason codes for no handoff:

- No response
- Contact not verified
- Center declined
- Wrong center selected
- Patient withdrew consent

## 8) Audit Trail (Must Log)

Log these events:

- Consent captured
- Target center selected/changed
- Contact attempts sent (channel + time)
- Recipient verification success/failure
- Link generated
- Link delivered
- Link viewed
- Link expired
- Patient fallback summary delivered/downloaded

## 9) Edge Cases (v1)

### Center says "send to my personal WhatsApp"

- Do not send full packet immediately
- Verify role and center authorization first
- Prefer secure link over file attachments

### Center asks for full records by email

- Use secure read-only link
- If fallback summary is used, send only patient-authorized transfer summary, not unrestricted raw data exports

### Patient changes target center after packet is prepared

- Stop previous pending handoff if not viewed
- Record new consent/target
- Re-run contact + verification for the new center

## 10) Pilot Defaults Chosen (2026-02-24)

- Read-only link expiry: 48 hours
- Allowed first outreach channels: phone call, WhatsApp, official email
- Minimum verification standard: one trusted-channel verification (preferred callback to public/verified center number; alternative official center email reply), with branch + role confirmation
- Fallback patient summary format: PDF + web summary

## 11) Pilot Decisions Still Open

- Who on `dialysis.my` team is authorized to verify and send links
