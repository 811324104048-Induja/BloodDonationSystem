# Problem Statement

## 1. Title

**Blood Donation Network & Emergency Matching Platform**

## 2. Domain

Healthcare / Blood Donation / Emergency Response

## 3. Who is the user?

The platform has three main user types:

- **Donor** – registers blood group, location, availability, and donation-related details, and can respond to blood requests.
- **Patient / Requester** – creates blood requests by specifying blood group, units required, hospital, location, and urgency.
- **Admin** – manages users and requests, monitors emergency cases, verifies reported misuse, and controls access to sensitive information.

## 4. What problem are we solving?

Patients and hospitals may struggle to find suitable blood donors quickly, especially during emergency situations. Manual searching through contacts, social media, or blood-donor lists can be slow, difficult to verify, and may expose unnecessary personal information. This platform provides a centralized system where patients can submit blood requests and the system can efficiently identify and rank suitable available donors based on blood-group compatibility, location, availability, and urgency. For example, when a patient urgently needs O+ blood at a hospital, the system can filter compatible available donors, prioritize nearby donors, and notify the most suitable candidates.

## 5. Proposed Solution (what the application will do, feature-wise)

The application will provide:

- Secure donor and patient registration and login.
- Donor profile management with blood group, location, availability, and donation history.
- Patient blood-request creation with required blood group, units, hospital, location, and urgency.
- Blood-group compatibility-based donor filtering.
- Location and availability-based donor matching.
- Emergency request prioritization for urgent and critical requirements.
- A matching and ranking algorithm to recommend the most suitable donors.
- AI-assisted ranking to estimate which suitable donors are more likely to respond, using historical/synthetic response data for the prototype.
- Notifications for relevant blood requests and donor responses.
- Donor acceptance/rejection and donation-status tracking.
- Admin dashboard for monitoring users, requests, matches, and misuse reports.
- Role-based access control so users can access only the information and operations permitted for their role.
- Audit logging for sensitive administrative actions.
- Optimized database queries, indexes, filtering, and limited result retrieval for efficient matching.
- Cloud deployment of the application and database.

## 6. Core Entities / Database Tables

The core database entities will include:

1. **User** – login credentials, role, account status, and basic user information.
2. **Donor** – donor-specific blood group, location, availability, and donation information.
3. **Patient** – patient/requester profile and hospital-related information.
4. **BloodRequest** – blood group, units, hospital, urgency, required date, and request status.
5. **Match** – donor-request relationship, matching score, distance, and response status.
6. **Donation** – completed donation records linked to donors and requests.
7. **Hospital** – hospital name, location, contact, and verification status.
8. **Notification** – notifications sent to donors, patients, or administrators.
9. **AuditLog** – records sensitive administrative or security-related actions.

## 7. User Roles & Permissions

### Donor

- Register and log in.
- Create and update their own donor profile.
- Set or update availability.
- View relevant blood requests.
- Accept or reject a donor match.
- View their own donation history and notifications.
- Cannot access other donors' private information or the admin dashboard.

### Patient / Requester

- Register and log in.
- Create and manage their own blood requests.
- View the status of their own requests.
- View suitable matched donors through controlled application information.
- Receive request and match notifications.
- Cannot access other patients' private records or administrative functions.

### Admin

- Manage and monitor users.
- Monitor blood and emergency requests.
- Review reported misuse and suspicious activity.
- Manage or deactivate accounts according to system rules.
- View system-level statistics and audit logs.
- Access sensitive administrative information according to authorization rules.

## 8. Success Criteria

The application will be considered successful when:

- A donor can register and update their availability successfully.
- A patient can create a blood request in **under 1 minute** under normal conditions.
- The system can return the **top suitable donor candidates within 2 seconds** for a normal prototype dataset after database filtering and indexing.
- Emergency/critical requests are prioritized over normal requests.
- Matching considers blood-group compatibility, donor availability, location, and urgency before ranking candidates.
- Unauthorized users are denied access to protected resources.
- Donor passwords are stored as secure hashes rather than plain text.
- Sensitive donor information is not exposed to users without permission.
- Admin actions on sensitive resources are recorded in audit logs.
- The application can be deployed and accessed through a cloud-hosted environment.
- The complete donor → request → matching → response → donation-status workflow can be demonstrated end-to-end.

## 9. Out of Scope

The following are intentionally excluded from the initial version:

- The application will **not** independently determine medical eligibility for blood donation.
- The application will **not** replace professional blood-bank or hospital verification.
- The application will **not** perform blood collection, testing, storage, or physical delivery of blood.
- The application will **not** guarantee donor availability or successful donation.
- The application will **not** expose a donor's private phone number, full address, medical history, or other sensitive information without appropriate authorization.
- The application will **not** make final medical compatibility decisions using AI; AI will only assist in ranking suitable candidates after rule-based filtering.
- Real-time GPS tracking of donors will not be included in the initial version.
- Payment processing and paid blood-donation services are out of scope.

## 10. Chosen Track

**Java (Spring Boot)**
