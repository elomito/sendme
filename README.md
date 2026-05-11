# SENDME

A cluster-based errand marketplace that helps people request items from outside while enabling others to earn small commissions by fulfilling those errands.

The system allows users within a shared environment such as a school, workplace, or residential cluster to request items from outside while enabling others to fulfill those requests in exchange for a small commission.

---

## 2. Problem Statement

Within shared communities:

- People frequently ask others to buy items such as food, supplies, or essentials
- These requests are often informal and disorganized
- There is no structured way to manage errands
- People helping others are not incentivized

This creates inefficiency and poor coordination.

---

## 3. Proposed Solution

SENDME is a web-based platform where:

- Users can post item requests
- Other users can browse available tasks
- Users going outside can accept and fulfill requests
- A small commission is added to each request as motivation
- Tasks are tracked from creation to completion

---

## 4. User Roles

### 4.1 Requester

A requester is a user who needs an item purchased.

#### Responsibilities

- Create requests
- Provide item details
- Receive completed items
- Pay the runner (outside the app for MVP)

---

### 4.2 Runner

A runner is a user who is going out and wants to fulfill tasks.

#### Responsibilities

- Browse available tasks
- Claim tasks
- Deliver items
- Mark tasks as completed

---

## 5. Core Features

### 5.1 User Authentication

Basic login and registration system.

#### User Information

- Username
- Password

---

### 5.2 Create Request

Users should be able to:

- Add item name
- Enter estimated/base price
- Add optional notes or preferences

The system automatically adds a commission fee.

#### Example

| Item | Amount |
|---|---|
| Base Price | 100 KES |
| Commission | 20 KES |
| Total Payout | 120 KES |

---

### 5.3 Task Feed

A page displaying all available (unclaimed) tasks.

Each task should display:

- Item name
- Total payout
- Requester name
- Notes (if any)

---

### 5.4 Claim Task

Users can select a task and mark it as **Accepted**.

Once claimed:

- The task is removed from the public feed
- The task becomes assigned to the runner

---

### 5.5 Task Status Tracking

Each task should move through the following states:

| Status | Description |
|---|---|
| Pending | Created but not yet claimed |
| Accepted | Claimed by a runner |
| Delivered | Completed by the runner |

---

### 5.6 Mark Task as Delivered

The runner marks the task as completed after delivery.

The task is then closed.

---

## 6. System Requirements

### 6.1 Backend

- Firebase

#### Responsibilities

- Authentication
- API handling
- Business logic
- Data management

---

### 6.2 Database

- Firebase Firestore

#### Suggested Collections

- Users
- Tasks

---

### 6.3 Frontend

- React
- Vite

#### UI Pages

- Login/Register page
- Task feed page
- Create request form

---

## 7. Basic Workflow

### Request Flow

1. User logs in
2. User creates a request
3. Request appears in the task feed

---

### Fulfillment Flow

1. Runner logs in
2. Runner browses task feed
3. Runner claims a task
4. Runner buys the item
5. Runner delivers the item
6. Runner marks the task as delivered

---


## 8. Future Enhancements

Potential future improvements include:

- Mobile money integration
- Ratings and trust system
- Push notifications
- Task batching
- “I’m going out” feature
- Wallet system
- Real-time updates

---

## 9. Conclusion

SENDME focuses on validating a simple but impactful idea:

> Turning everyday errands into small earning opportunities within a community.

By keeping the MVP lightweight and focused, the system can quickly test usability, adoption, and real-world practicality before scaling further.

---

## Tech Stack Summary

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend tooling |
| Firebase Authentication | User authentication |
| Firebase Firestore | Database |
| CSS | Styling |

---

## Suggested Project Structure

```bash
sendme/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── firebase/
│   ├── hooks/
│   ├── context/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

---

### Clone the Repository

```bash
git clone https://github.com/yourusername/sendme.git

cd sendme
```

---

### Install Dependencies

```bash
npm install
```

---

### Run the Development Server

```bash
npm run dev
```

---