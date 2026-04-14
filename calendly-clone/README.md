# Calendly Clone

A full-stack scheduling application cloning the core functionality of Calendly. 
Built using Next.js 14, Express.js, and PostgreSQL.

## Features

- **Event Types**: Create and manage different types of events with customizable durations and descriptions.
- **Availability Management**: Set available hours day by day.
- **Booking Flow**: Public booking page for invitees to pick a date/time and fill in details.
- **Dashboard**: View upcoming and past scheduled meetings.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Shadcn-like UI structure.
- **Backend**: Node.js, Express.js, PostgreSQL (Raw SQL queries via \`pg\` library).

## Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running

## Setup Instructions

### 1. Database Setup

1. Create a database in PostgreSQL named \`calendly_clone\` (or similar).
2. Inside the \`backend\` folder, locate \`schema.sql\` and \`seed.sql\`.
3. Run the schema creation and then seed the data:
   \`\`\`bash
   psql -U your_postgres_user -d calendly_clone -f backend/schema.sql
   psql -U your_postgres_user -d calendly_clone -f backend/seed.sql
   \`\`\`

### 2. Backend Setup

1. Navigate to the \`backend\` directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file in the \`backend\` directory based on the \`.env.example\` file. Ensure you update your \`DATABASE_URL\` string properly:
   \`\`\`env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/calendly_clone
   FRONTEND_URL=http://localhost:3000
   \`\`\`
4. Start the backend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### 3. Frontend Setup

1. Navigate to the \`frontend\` directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Ensure you have the \`.env.local\` file set correctly:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`
4. Start the Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Assumptions & Design Decisions
- For simplicity and the scope of a clone, a static admin user ("John Doe") with \`user_id = 1\` is assumed as logged in the backend. 
- Overlapping bookings logic ensures that an invitee cannot book a slot if another confirmed meeting is going on during that time.
- Time zones are stored basically as strings. Advanced timezone handling uses the native date-fns capabilities.
- The UI mimics the classic Calendly blue scheme (#006BFF).
