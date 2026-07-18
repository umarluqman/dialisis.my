# Patient Data Hub Pivot Plan

Date: 2026-02-24
Product: `dialysis.my` (pivot direction)
Market: Malaysia
Primary users: Patients/caregivers, dialysis center nurses/coordinators, doctors

## 1) Core Idea

Make `dialysis.my` the hub where patients submit dialysis-related health information once, then `dialysis.my` helps prepare and route the data to the dialysis center in a usable format.

Key user promise:

- When a patient changes dialysis centers, their information moves digitally through `dialysis.my` instead of relying on physical files and repeated manual handover.

Goal:

- Reduce manual data collection by patients.
- Reduce repetitive follow-up and re-entry by nurses.
- Help doctors receive more complete information earlier.
- Create the foundation for a center subscription product after workflow value is proven.

## 2) Problem We Are Solving

Today, the intake and coordination process is fragmented:

- Patients and family repeat the same details many times.
- Nurses chase missing information through calls/WhatsApp.
- Doctors get incomplete or inconsistent data.
- Important details can be delayed, unclear, or entered in different formats.

Result:

- More admin work.
- Slower handoff to care teams.
- Poor experience for both patient and center staff.

## 3) Product Positioning (Now vs Later)

### What `dialysis.my` is now

- A patient data intake and coordination hub for dialysis workflows.
- A structured handoff layer between patient and dialysis center.
- A patient-first trust layer that reduces transfer friction.

### What `dialysis.my` is not yet

- Not focused on selling leads.
- Not leading with pricing/packages in go-to-market.
- Not a full EMR/HIS replacement.
- Not making medical decisions or treatment recommendations.

### What stays true from the previous plan

These goals are still true:

- Help centers fill more dialysis chairs per branch.
- Increase trust and preference for dialysis centers on `dialysis.my`.
- Build a product centers will pay for.

What changed is the path:

- Before: sell center growth outcomes first (harder to sell early).
- Now: solve the patient transfer/intake problem first.
- Result: patient value creates staff/doctor value, which becomes the center sales story.

### Commercial thesis (patient-first, center-paid)

- Patient-side workflow solves the immediate pain.
- Nurse/doctor workflow improves because handoff data is cleaner.
- Center operations improve (faster intake, less manual chasing, better transfer handling).
- Centers subscribe to access the digital handoff workflow and center management tools.

### Neutrality and trust policy

`dialysis.my` should look patient-first and neutral.

- Replace `Pilihan Utama` with `Verified`.
- `Verified` means objective trust checks passed, not paid favoritism.
- If paid promotion is introduced later, label it separately (for example `Sponsored`) and do not mix it with `Verified`.

Reference:

- `docs/patient-data-hub-plans/verified-badge-criteria-v1.md`

## 4) Who We Serve First

### Primary

- Patients starting dialysis or transferring centers.
- Caregivers submitting information on behalf of patients.

### Secondary

- Dialysis center nurse/coordinator handling intake and scheduling.
- Doctor reviewing pre-visit information.
- Nephrologist reviewing patient information before transfer/continuity decisions.

### Buyer later (not current focus)

- Dialysis center owner/operator or multi-branch group.
- Subscription buyer for center access, center editor, and `Verified` badge.

## 5) MVP Scope (Keep It Simple)

Build the smallest useful workflow that removes manual work.

### Must-have (Phase 1 MVP)

- Patient/caregiver intake form with structured fields.
- Consent and contact permission capture.
- Save progress and resume later.
- Basic validation (required fields, phone format, missing items).
- Staff review view (internal queue/status list).
- Transfer-ready patient packet (digital summary for center handoff).
- Center handoff output:
  - Human-readable summary (PDF or web view)
  - Structured field list for nurse/admin use
- Status tracking (`new`, `needs follow-up`, `ready to send`, `sent to center`, `center acknowledged`)
- Audit trail (who submitted, when updated, when sent)

### Good to have (Phase 2, after MVP works)

- Reminders for missing information.
- Document uploads (lab reports/referral letter).
- Multi-language support (BM/English).
- Center-specific intake templates.
- Follow-up questionnaire after first submission.
- Center portal access for subscribed centers (receive cases + acknowledge).
- Center profile editor (images, information, service updates).
- `Verified` badge workflow and review checklist.

### Out of scope for now

- Automated lead pricing/billing.
- Advanced analytics dashboards for clients.
- Deep integrations with hospital systems/EMR.
- Clinical scoring/recommendation engine.
- Paid ranking/placement features.

## 6) Initial Data Scope (MVP)

Use a minimum dataset that is operationally useful, not a full medical record.

Data design principle:

- Collect enough data to support a safe, useful transfer/intake handoff without trying to become a full medical file repository on day 1.

### Patient identity and contact

- Full name
- IC/passport (if required by partner center)
- Phone number
- Caregiver contact (optional)
- Preferred contact channel

### Care context

- Current dialysis status (`new`, `existing`, `transfer`)
- Current center (if transferring)
- Preferred center/location
- Preferred schedule (if known)
- Urgency/timeline (`now`, `within 7 days`, `within 30 days`, `planning`)

### Health info (basic intake)

- Diagnosis summary / reason for referral (free text)
- Comorbidities checklist (simple)
- Current medications (basic list)
- Relevant history fields agreed with pilot center
- Transfer/continuity notes needed by receiving center (pilot-defined)

### Consent

- Consent to collect and share data with selected center
- Consent timestamp
- Submitter relationship to patient

## 7) Core Workflow (MVP)

1. Patient/caregiver opens `dialysis.my` intake link.
2. They submit structured information and consent.
3. System validates completeness and flags missing items.
4. Internal coordinator reviews and marks status.
5. `dialysis.my` prepares a transfer-ready patient packet.
6. `dialysis.my` sends a clean summary to the target subscribed center.
7. Center nurse acknowledges receipt / requests missing info.
8. `dialysis.my` tracks completion and turnaround time.

### Non-subscribed center transfer handling (v1 policy)

Do not block the patient transfer if the target center is not subscribed.

Policy:

- The patient owns the transfer packet and can authorize sharing.
- Subscription pays for workflow convenience and ongoing access, not for the patient's right to move their data.

v1 flow for non-subscribed centers:

1. Patient selects a target center and gives consent to share.
2. `dialysis.my` contacts the center and informs them a patient-authorized transfer packet is available on the hub.
3. `dialysis.my` verifies the receiving contact before sharing any sensitive details.
4. Center gets a secure, time-limited, read-only access link to view the packet (one-time or expiring).
5. If the center does not register or does not respond, the patient can still download/share a transfer-ready summary (PDF/web summary) themselves.
6. `dialysis.my` logs invite, view, expiry, and access events in the audit trail.

What is not available to non-subscribed centers in v1:

- Multi-staff access
- Ongoing packet history
- Center inbox/case queue
- Structured workflow acknowledgments inside the platform
- Center editor
- `Verified` badge eligibility

Reference:

- `docs/patient-data-hub-plans/non-subscribed-center-contact-verification-v1.md`

Key principle:

- Patients should not need to repeat the same data unless something changed.
- Patient value comes first, but the same workflow becomes the center product later.

## 8) Operating Model (Manual + Product Assisted)

Start with a semi-manual service so the workflow is proven before full automation.

### `dialysis.my` team responsibilities (pilot)

- Define intake fields with pilot center.
- Review submissions for completeness.
- Prepare/send standardized handoff.
- Track center feedback and missing fields.
- Improve form based on repeated issues.

### Pilot center responsibilities

- Confirm required intake fields.
- Assign a receiving contact (nurse/admin).
- Acknowledge received cases.
- Provide feedback on data quality and missing items.

### Commercial transition after pilot proof

Patient-side access remains focused on problem-solving and adoption.

Center-side monetization starts after pilot validation:

- Center subscribes to receive digital patient handoff packets through the platform.
- Subscription unlocks center access/inbox for incoming cases.
- Subscription unlocks center profile editor (images, information, updates).
- Subscription unlocks `Verified` badge eligibility and review process.

This keeps the product patient-first while making the business center-paid.

## 9) 90-Day Rollout Plan

### Days 1-14: Workflow validation

- Interview 3-5 patients/caregivers on current process pain.
- Interview 2-3 nurses + 1 doctor on required handoff info.
- Define MVP field list and handoff format.
- Pick 1 pilot center.

### Days 15-45: MVP build and internal testing

- Build intake form + save/resume + consent capture.
- Build internal review queue and statuses.
- Build summary output (PDF/web view).
- Run 10-20 internal test cases using real scenarios (anonymized).

### Days 46-75: Pilot launch (1 center)

- Start with a limited number of real submissions.
- Track missing-info rate and turnaround time.
- Adjust field list once (not constantly).
- Standardize handoff SOP.
- Test center acknowledgment flow and subscription handoff entitlement assumptions.

### Days 76-90: Validate value and prepare next phase

- Review pilot metrics with center.
- Confirm top manual tasks removed.
- Decide Phase 2 features.
- Start packaging/pricing design only after workflow value is proven.
- Define `Verified` badge criteria and center onboarding checklist.

## 10) Success Metrics (Pilot)

Measure workflow value, not revenue yet.

### Primary (patient + workflow value)

- Submission completion rate
- Average time for patient to complete intake
- Percentage of submissions needing follow-up for missing info
- Nurse/admin time spent per intake (before vs after)
- Time from patient submission to center-ready handoff
- Center acknowledgment rate
- Repeat data entry reduction (qualitative + measured where possible)
- Satisfaction feedback from patients and staff (simple score)

### Secondary (commercial proof signals from previous plan)

- Number of centers asking to continue after pilot
- Number of incoming transfer/intake cases handled per center
- Center-reported reduction in admin friction
- Center-reported speed to accept/schedule patient
- Early willingness-to-pay signals for subscription access
- Trust lift indicators (for example, interest in `Verified` badge and profile editor usage)

## 11) Risks and How To Reduce Them

### Risk: Too much data requested too early

- Start with minimum required fields.
- Add fields only if pilot center proves they are necessary.

### Risk: Center workflow mismatch

- Co-design field list and handoff format with one pilot center first.

### Risk: Trust/privacy concerns from patients

- Clear consent language.
- Explain who receives data and why.
- Limit data access by role.

### Risk: Perceived bias if centers pay for access

- Keep patient-facing trust label as `Verified` (objective checks).
- Do not use `Verified` as a paid ranking label.
- Separate subscription access from search ranking claims.

### Risk: Becoming a custom service for each center too soon

- Use one standard intake model with small center-specific additions.

### Risk: Monetization added too early and harms adoption

- Pilot the workflow first.
- Introduce subscription gating only after the center-side value is clear.
- Keep patient experience simple and trust-centered.

## 12) Decisions Needed This Week

- Which pilot center (or friendly center) to work with first?
- What exact handoff format should MVP use first: PDF, secure web view, email, or WhatsApp-assisted summary?
- What is the minimum field list required for the first center?
- Who inside `dialysis.my` reviews submissions during pilot?
- What languages must MVP support on day 1 (BM only vs BM + English)?
- What are the first objective criteria for `Verified` (contact validity, completeness, licensing/business checks, response behavior)?

## 13) Packaging Later (Deliberately Deferred)

Do not finalize pricing/packages yet.

Package design should happen only after:

- Pilot proves time saved for staff
- Data completeness improves
- Handoff workflow is stable
- Center can describe the value in operational terms
- Subscription entitlements (data access, editor, `Verified`) are validated in pilot workflow discussions

Use `docs/patient-data-hub-plans/package-options-later.md` as the decision framework when ready.
