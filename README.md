![APPSOL CMS](https://lh3.googleusercontent.com/pw/AP1GczMJBTBEHbmDShgTYpWTmikYXobuKnad15FEpd1YJT7MyX7J5tBcnMRhGdIwrvcWB145sOJw2vXru6BTHvZC-OmQchGeAUKvdPDVjCQDmezzfKTtEg=w2400)


# 🧩 Appsol CMS - Backend API

Appsol CMS (Customer Management System) is a bespoke platform designed to help organizations efficiently manage customer relationships, track operational activities, and gain valuable insights through dynamic dashboards.

This repository contains the backend API for Appsol CMS — built to provide secure, scalable, and maintainable endpoints for customer operations, payment tracking, notifications, and more.

---

## 🚀 Features (MVP)

### 📊 Dashboard & Insights

- Dashboard summaries of key metrics
- Monthly retrievals and balances
- Yearly revenue tracking (completed payments)
- Yearly retrieval tracking (due payments)
- Recent transactions (payments, enquiries, complaints, etc.)

### 👥 Core Functionalities

1. **User Login & Authentication**
2. **Customer Complaints Logging**
3. **Customer Outreach Logging** (Periodic calls, follow-ups)
4. **Customer Enquiries Tracking (Lead Tracker)**
5. **Customer Reschedule Tracker**
6. **Customer Setup Tracker**
7. **Calendar & Scheduling**
8. **Subscription Payments & Renewals**
   - Two stages: creation and approval
9. **Feature Requests Logging**
10. **Subscription Reminders**
11. **Notifications System**
12. **Dashboard Summaries & Automated Triggers**

---

## 🏗️ Tech Stack (Proposed)

| Layer                | Technology                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language             | **TypeScript**                                                                                                                                                                                                                         |
| Runtime              | **Node.js**                                                                                                                                                                                                                            |
| Framework            | **Express.js**                                                                                                                                                                                                                         |
| Database             | **MongoDB**                                                                                                                                                                                                                            |
| ORM / ODM            | **Mongoose**                                                                                                                                                                                                                           |
| Authentication       | **JWT / OAuth2**                                                                                                                                                                                                                       |
| Notifications        | **Firebase Cloud Messaging (FCM)**                                                                                                                                                                                                     |
| Task Scheduling      | **Node Cron**                                                                                                                                                                                                                          |
| API Documentation    | [**Postman**](https://interstellar-rocket-860831.postman.co/workspace/New-Team-Workspace~7d60c845-06e2-40af-be78-d7f7de323b65/collection/17143791-18b5374a-62ce-4ee7-9f69-e407885d0472?action=share&source=copy-link&creator=17143791) |
| Dependency Injection | **Inversify**                                                                                                                                                                                                                          |

---

## 📁 Project Structure (Suggested)
