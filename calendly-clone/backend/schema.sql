-- schema.sql
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS availability_overrides CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS availability_schedules CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_types (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT '#006BFF',
  buffer_before_minutes INTEGER DEFAULT 0,
  buffer_after_minutes INTEGER DEFAULT 0,
  custom_questions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS availability_schedules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  schedule_id INTEGER REFERENCES availability_schedules(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(schedule_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS availability_overrides (
  id SERIAL PRIMARY KEY,
  schedule_id INTEGER REFERENCES availability_schedules(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(schedule_id, override_date)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  event_type_id INTEGER REFERENCES event_types(id) ON DELETE CASCADE,
  invitee_name VARCHAR(255) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  invitee_answers JSONB DEFAULT '{}'::jsonb,
  rescheduled_from_booking_id INTEGER REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
