-- seed.sql

-- Clear existing data
TRUNCATE TABLE bookings, availability, availability_overrides, availability_schedules, event_types, users RESTART IDENTITY CASCADE;

-- Insert Admin User
INSERT INTO users (name, email, username, timezone)
VALUES ('John Doe', 'john@example.com', 'john-doe', 'Asia/Kolkata');

-- Insert Event Types
INSERT INTO event_types (user_id, title, slug, duration_minutes, description, color, buffer_before_minutes, buffer_after_minutes, custom_questions)
VALUES
(1, '15 Minute Meeting', '15-minute-meeting', 15, 'A quick 15-minute introductory catch-up.', '#006BFF', 0, 0, '[{"question": "What is this about?", "required": true}]'::jsonb),
(1, '30 Minute Meeting', '30-minute-meeting', 30, 'Standard 30-minute discussion.', '#00A859', 5, 5, '[]'::jsonb),
(1, '1 Hour Meeting', '1-hour-meeting', 60, 'Deep dive 1-hour session.', '#FF8D00', 10, 10, '[]'::jsonb);

-- Insert Default Schedule
INSERT INTO availability_schedules (user_id, name, is_default)
VALUES (1, 'Working Hours', true);

-- Insert Availability (Monday-Friday, 9:00 AM - 5:00 PM IST)
-- Mon is 1, Tue is 2, Wed 3, Thu 4, Fri 5
INSERT INTO availability (schedule_id, day_of_week, start_time, end_time, is_available)
VALUES
(1, 1, '09:00:00', '17:00:00', true),
(1, 2, '09:00:00', '17:00:00', true),
(1, 3, '09:00:00', '17:00:00', true),
(1, 4, '09:00:00', '17:00:00', true),
(1, 5, '09:00:00', '17:00:00', true),
(1, 6, '09:00:00', '17:00:00', false),
(1, 0, '09:00:00', '17:00:00', false);

-- Insert Sample Bookings
INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, status)
VALUES
-- Upcoming 1
(1, 'Alice Smith', 'alice@example.com', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 15 minutes', 'confirmed'),
-- Upcoming 2
(2, 'Bob Johnson', 'bob@example.com', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '11 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '11 hours 30 minutes', 'confirmed'),
-- Upcoming 3
(3, 'Charlie Brown', 'charlie@example.com', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '15 hours', 'confirmed'),
-- Past 1
(1, 'David Lee', 'david@example.com', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours 15 minutes', 'confirmed'),
-- Past 2
(2, 'Eva Green', 'eva@example.com', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '13 hours', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '13 hours 30 minutes', 'confirmed');
