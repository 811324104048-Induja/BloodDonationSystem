# Blood Donation Network & Emergency Matching Platform

## 1. Project Overview

The Blood Donation Network & Emergency Matching Platform is a full-stack web application designed to connect blood donors with patients who require blood during normal and emergency situations.

The system allows donors to register their blood group and availability, while patients can submit blood requests based on their blood group, required units, hospital location, and urgency.

The system uses a matching algorithm to identify suitable donors based on:

- Blood group compatibility
- Donor availability
- Distance from the hospital
- Emergency priority
- Donor eligibility
- Previous donation information

The platform helps reduce the time required to find suitable blood donors and provides a centralized system for managing blood donation requests.

---

## 2. Main Features

### Donor

- Register as a blood donor
- Login securely
- Maintain donor profile
- Add blood group and location
- Update availability status
- View blood donation requests
- Accept or reject matching requests
- View donation history

### Patient

- Register and login
- Create blood requests
- Specify blood group
- Specify required blood units
- Select hospital
- Set request urgency
- Track request status
- View matched donors

### Hospital

- Register hospital information
- Manage blood requests
- View suitable donor matches
- Update donation/request status

### Admin

- Manage users
- Verify donor and hospital information
- Monitor blood requests
- Manage suspicious or invalid accounts
- View audit logs

---

## 3. Emergency Matching

The application provides an automated donor matching mechanism.

A donor is considered for a request based on:

1. Blood group compatibility
2. Donor availability
3. Donor eligibility
4. Distance from the required hospital
5. Emergency priority

Suitable donors are assigned a matching score.

Higher-priority and closer compatible donors are ranked first.

The matching process is designed to provide efficient donor retrieval for urgent blood requirements.

---

## 4. Technology Stack

### Frontend

- React.js
- HTML
- CSS
- JavaScript

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security

### Database

- MySQL

### API

- RESTful APIs

### Build Tool

- Maven

### Development Tools

- Visual Studio Code / IntelliJ IDEA
- MySQL Workbench
- Git
- GitHub

---

## 5. System Architecture

The application follows a three-layer architecture:

```text
React Frontend
      |
      | REST API
      v
Spring Boot Backend
      |
      | JPA / Hibernate
      v
MySQL Database
