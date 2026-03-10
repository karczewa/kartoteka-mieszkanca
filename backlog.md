# Kartoteka Mieszkańca — Product Backlog

---

## Epic 1: User Layout

### UL-01 · Application Front Page
**As a** user,
**I want to** see a structured front page when I open the application,
**so that** I can navigate to the main areas of the system easily.

**Acceptance Criteria:**
- Page contains a top navigation bar with the application name/logo
- Navigation includes two tabs: **Mieszkańcy** (Citizens) and **Rejestr** (Backlog)
- All UI text, labels, buttons, and messages are in Polish
- Active tab is visually highlighted
- Switching tabs does not reload the page (SPA navigation)

---

### UL-02 · Citizens Tab
**As a** clerk,
**I want to** access the Citizens section from the main navigation,
**so that** I can manage citizen records from a central place.

**Acceptance Criteria:**
- Clicking the **Citizens** tab displays the citizen list/search view
- Default view shows a search bar and an empty results area with a prompt
- A "Register new citizen" button is visible on this tab

---

### UL-03 · Polish Language UI
**As a** user,
**I want to** use the application entirely in Polish,
**so that** municipal clerks can work in their native language without confusion.

**Acceptance Criteria:**
- All labels, buttons, headings, and navigation items are in Polish
- All validation and error messages are in Polish
- All form field placeholders are in Polish
- Date format follows Polish convention (DD.MM.YYYY)
- No English strings are visible to end users

---

### UL-05 · Backlog Tab
**As a** clerk,
**I want to** access the Backlog section from the main navigation,
**so that** I can see pending tasks and work items.

**Acceptance Criteria:**
- Clicking the **Rejestr** tab displays the backlog view
- Active tab state is preserved on page refresh

---

## Epic 2: Citizen Record Management

### US-01 · Register a New Citizen
**As a** clerk,
**I want to** register a new citizen by entering their personal data,
**so that** their record is stored in the system.

**Acceptance Criteria:**
- Form requires: first name, last name, PESEL, registered address
- PESEL is validated using the checksum algorithm
- Date of birth and sex are derived automatically from PESEL
- Duplicate PESEL is rejected with a clear error
- Optional fields: phone, email, correspondence address
- On success, the new citizen record is displayed

---

### US-02 · View Citizen Record
**As a** clerk,
**I want to** view a citizen's full record,
**so that** I can access all their information in one place.

**Acceptance Criteria:**
- Record displays: personal data, contact info, registered address
- Record displays: active identity document
- Record displays: current registration status (permanent/temporary)
- Links/tabs to full document history and registration history are available

---

### US-03 · Update Citizen Data
**As a** clerk,
**I want to** edit a citizen's personal and contact information,
**so that** the records remain current.

**Acceptance Criteria:**
- All editable fields can be updated (name, contact, correspondence address)
- PESEL cannot be changed after creation
- Changes are saved and immediately reflected in the record
- Modification is recorded in the audit log

---

### US-04 · Delete a Citizen Record
**As a** clerk,
**I want to** delete a citizen's record,
**so that** outdated entries can be removed from the system.

**Acceptance Criteria:**
- Clerk must confirm deletion before it is executed
- Deletion removes the citizen and all associated data
- The action is recorded in the audit log
- Deleted records cannot be retrieved after confirmation

---

## Epic 3: Search & Lookup

### US-05a · Search by Name
**As a** clerk,
**I want to** search for citizens by first name, last name, or both,
**so that** I can quickly find a specific record.

**Acceptance Criteria:**
- Search field accepts first name, last name, or a combination
- Partial matching is supported (e.g., "Kow" matches "Kowalski")
- Results are displayed in a paginated list
- Each result shows: name, PESEL, city — as a link to the full record

---

### US-05b · Search by PESEL
**As a** clerk,
**I want to** search for a citizen by their PESEL number,
**so that** I can retrieve their record instantly.

**Acceptance Criteria:**
- Exact PESEL match returns the citizen's record directly
- Invalid PESEL format shows a validation error
- No result found displays an appropriate message

---

### US-05c · Search by Address
**As a** clerk,
**I want to** search for citizens by city or street,
**so that** I can find all residents at a given location.

**Acceptance Criteria:**
- Search accepts city, street, or both
- Partial matching supported for city and street names
- Results are paginated
- Each result links to the full citizen record

---

## Epic 4: Identity Documents

### US-06 · Add an Identity Document
**As a** clerk,
**I want to** add an identity document to a citizen's record,
**so that** their current and historical IDs are tracked.

**Acceptance Criteria:**
- Document types supported: `ID card`, `passport`
- Required fields: type, series & number, issue date, expiry date, issuing authority
- A newly added document can be marked as active
- If marked active, the previous active document is automatically deactivated
- Multiple documents per citizen are allowed

---

### US-06b · Validate Document Series and Number Format
**As a** clerk,
**I want** the system to reject invalid series and number formats when adding a document,
**so that** I cannot accidentally enter a number in the series field or a letter in the number field.

**Acceptance Criteria:**
- Series field accepts letters only (A–Z); digits are rejected with an error message
- Number field accepts digits only (0–9); letters are rejected with an error message
- Validation fires on form submission and shows a clear inline error in Polish
- Valid input passes through without interruption

---

### US-07 · View Document History
**As a** clerk,
**I want to** view the full history of a citizen's identity documents,
**so that** I can see both past and current IDs.

**Acceptance Criteria:**
- List shows all documents: type, series/number, issue/expiry dates, issuing authority
- Active document is clearly distinguished from historical ones
- Documents are sorted by issue date (most recent first)

---

## Epic 5: Registration History

### US-08 · Record an Address Registration Change
**As a** clerk,
**I want to** record a change in a citizen's address registration,
**so that** their current and historical residence is maintained.

**Acceptance Criteria:**
- Clerk enters: new address, registration type (permanent/temporary), effective date
- Previous address is automatically saved as the prior registration entry
- The citizen's current registered address is updated
- Change is recorded in the audit log

---

### US-09 · View Registration History
**As a** clerk,
**I want to** view a citizen's full registration history,
**so that** I can see all past and current addresses.

**Acceptance Criteria:**
- List shows all entries: address, registration type, effective date
- Entries are sorted chronologically (most recent first)
- Current registration is clearly marked

---

## Epic 6: Audit Log

### AUD-01 · Audit Log for Data Modifications
**As a** user,
**I want** all data modification operations to be automatically logged,
**so that** there is a traceable record of every change.

**Acceptance Criteria:**
- Every create, update, delete operation records: timestamp, operation type, affected record
- Log entries cannot be edited or deleted
- Log is visible to all users

---

### AUD-02 · Audit Log for Record Access
**As a** user,
**I want** all access to citizen records to be logged,
**so that** there is a full history of who viewed what and when.

**Acceptance Criteria:**
- Every view/read of a citizen record records: timestamp, record accessed
- Log entries cannot be modified
- Log is queryable by date range

---

## Backlog Summary

| Epic | Stories | Priority |
|---|---|---|
| 1. User Layout | UL-01, UL-02, UL-03, UL-05 | High — foundation for all UI |
| 2. Citizen Record Management | US-01, US-02, US-03, US-04 | High — core functionality |
| 3. Search & Lookup | US-05a, US-05b, US-05c | High — daily clerk workflow |
| 4. Identity Documents | US-06, US-06b, US-07 | Medium |
| 5. Registration History | US-08, US-09 | Medium |
| 6. Audit Log | AUD-01, AUD-02 | Medium |
