# MoneyFlow — Personal Finance Dashboard

A portfolio-ready frontend project built with React, Vite, Firebase, React Router, Tailwind CSS and Recharts.

## What this project demonstrates

- Firebase Authentication with Google login
- Protected routes
- Firestore CRUD operations
- Real-time transaction updates
- Dashboard statistics
- Expense and income charts
- Monthly budgets
- CSV export
- Responsive dashboard layout

## Tech stack

- React
- Vite
- Firebase Auth
- Cloud Firestore
- React Router
- Tailwind CSS
- Recharts
- Lucide React icons

## Pages

- `/login` — Google authentication
- `/dashboard` — balance, income, expenses and charts
- `/transactions` — create, list, delete and export transactions
- `/budgets` — monthly category budget tracking
- `/reports` — visual finance reports
- `/settings` — user info and future preferences

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project

Go to Firebase Console and create a project.

Enable:

- Authentication → Google provider
- Firestore Database

### 3. Add Firebase environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then replace the values with your Firebase web app config.

### 4. Run the app

```bash
npm run dev
```

## Firestore structure

```txt
users/{userId}/transactions/{transactionId}
users/{userId}/budgets/{budgetId}
```

10. Portfolio case study page

Created by:
Ernesto Pinto
MoneyFlow is a responsive personal finance dashboard that helps users track income, expenses, budgets and spending insights. It uses Firebase Authentication and Firestore to provide user-specific real-time data, with charts and CSV export for financial analysis.
