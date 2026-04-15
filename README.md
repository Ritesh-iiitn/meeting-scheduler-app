# Calendly Clone

A full-stack scheduling application cloning the core functionality of Calendly. 
Built using Next.js 14, Express.js, and PostgreSQL.

## Features

- **Event Types**: Create and manage different types of events with customizable durations and descriptions.
- **Availability Management**: Set available hours day by day.
- **Booking Flow**: Public booking page for invitees to pick a date/time and fill in details.
- **Dashboard**: View upcoming and past scheduled meetings.

### 🚀 Advanced Features Added
- **Responsive Design**: UI utilizes dynamic Tailwind CSS breakpoint utility classes (`md:`, `lg:`) so the interface adapts seamlessly across mobile screens, tablets, and desktop displays.
- **Multiple Availability Schedules**: Employs an `availability_schedules` relational mapping, permitting the creation of multiple distinct weekly hours templates for the user.
- **Date-Specific Overrides**: An `availability_overrides` ruleset handles specific days (such as vacations or sick days). If an override exists for a date, the slot-generation logic utilizes the override parameters rather than the user's default weekly template.
- **Rescheduling Flow**: Includes a `rescheduled_from_booking_id` property on bookings. A new booking submitted with a rescheduling footprint cascades an automatic cancellation to the preceding booking state.
- **Buffer Times**: Supports `buffer_before_minutes` and `buffer_after_minutes` natively on Event Types. The backend dynamically shifts availability overlaps, ensuring users cannot get booked back-to-back inside overlapping buffer periods.
- **Email Notifications**: Integrated asynchronously via `nodemailer` inside the `emailService.js` structure. Fires confirmations and cancellation messages directly to invitees.
- **Custom Invitee Questions**: Employs scalable `JSONB` array schemas (`custom_questions` on Event Types, `invitee_answers` on Bookings) allowing dynamic intake forms.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Shadcn-like UI structure.
- **Backend**: Node.js, Express.js, PostgreSQL (Raw SQL queries via `pg` library).

## Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running

## Setup Instructions

### 1. Database Setup

1. Create a database in PostgreSQL named `calendly_clone` (or similar).
2. Use the built-in migration script to establish tables and seed data:
   ```bash
   cd backend
   node migrate.js
   ```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on the `.env.example` file. Ensure you update your `DATABASE_URL` string properly:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/calendly_clone
   FRONTEND_URL=http://localhost:3000
   
   # Email Configurations
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   SMTP_FROM=noreply@example.com
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have the `.env.local` file set correctly:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel & Render)

If asked about deploying this application to production, make sure you configure the environment variables correctly on your host platforms.

**Render (Backend variables limit):**
* `DATABASE_URL`: Setup raw Postgres connection string pointing to your prod database.
* `FRONTEND_URL`: Your Vercel frontend domain (e.g. `https://calendly-clone-demo.vercel.app`)
* *(Optional)* `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` for sending verification emails.

**Vercel (Frontend variables limit):**
* `NEXT_PUBLIC_API_URL`: Points to the deployed Render Web Service URL (e.g. `https://calendly-api-demo.onrender.com/api`).
* `NEXT_PUBLIC_APP_URL`: Your own deployed Vercel String.

## Assumptions & Design Decisions
- For simplicity and the scope of a clone, a static admin user ("John Doe") with `user_id = 1` is assumed as logged in the backend. 
- Overlapping bookings logic ensures that an invitee cannot book a slot if another confirmed meeting is going on during that time + buffer time logic.
- Time zones are stored basically as strings. Advanced timezone handling uses the native date-fns capabilities.
- The UI mimics the classic Calendly professional scheme.
