const db = require('../db');
const { addMinutes, isBefore, parseISO, format, set, startOfDay, endOfDay, isPast } = require('date-fns');
const emailService = require('../services/emailService');

exports.getAllBookings = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT b.*, e.title as event_title 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      ORDER BY b.start_time DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getUpcomingBookings = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT b.*, e.title as event_title 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE b.start_time >= CURRENT_TIMESTAMP AND b.status = 'confirmed'
      ORDER BY b.start_time ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getPastBookings = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT b.*, e.title as event_title 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE b.start_time < CURRENT_TIMESTAMP OR b.status = 'cancelled'
      ORDER BY b.start_time DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { event_type_id, invitee_name, invitee_email, start_time, notes, invitee_answers, rescheduled_from_booking_id } = req.body;

    // Fetch event type to calculate end_time
    const { rows: eventRows } = await db.query('SELECT * FROM event_types WHERE id = $1', [event_type_id]);
    if (eventRows.length === 0) return res.status(404).json({ error: 'Event type not found' });

    const eventType = eventRows[0];
    const startDate = new Date(start_time);
    const endDate = addMinutes(startDate, eventType.duration_minutes);

    // If rescheduling, cancel the old booking
    if (rescheduled_from_booking_id) {
       await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [rescheduled_from_booking_id]);
    }

    // Check if slot is already booked, taking buffer times into account
    // For simplicity we use duration+buffer as the block
    const conflictStart = addMinutes(startDate, -eventType.buffer_before_minutes);
    const conflictEnd = addMinutes(endDate, eventType.buffer_after_minutes);

    const { rows: existingRows } = await db.query(`
      SELECT * FROM bookings 
      WHERE event_type_id = $1 AND status = 'confirmed' 
      AND (
        (start_time < $3 AND end_time > $2)
      )
    `, [event_type_id, conflictStart.toISOString(), conflictEnd.toISOString()]);

    const { rows } = await db.query(`
      INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes, invitee_answers, rescheduled_from_booking_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [event_type_id, invitee_name, invitee_email, startDate.toISOString(), endDate.toISOString(), notes, invitee_answers || '{}', rescheduled_from_booking_id || null]);

    const newBooking = rows[0];
    
    // Send email asynchronously
    emailService.sendBookingConfirmation({
      invitee_name,
      invitee_email,
      event_title: eventType.title,
      start_time: startDate,
      notes
    }).catch(console.error);

    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *", [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    
    const booking = rows[0];
    
    emailService.sendBookingCancellation({
      invitee_name: booking.invitee_name,
      invitee_email: booking.invitee_email,
      event_title: 'Your Event',
      start_time: booking.start_time
    }).catch(console.error);

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { eventSlug, date } = req.params; // date format: YYYY-MM-DD

    // 1. Get event type
    const { rows: eventRows } = await db.query('SELECT * FROM event_types WHERE slug = $1', [eventSlug]);
    if (eventRows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const eventType = eventRows[0];

    // 2. Get user availability for that day of week or overrides
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0(Sun) - 6(Sat)

    // Get active schedule for user
    const { rows: schedRows } = await db.query('SELECT * FROM availability_schedules WHERE user_id = $1 ORDER BY is_default DESC LIMIT 1', [eventType.user_id]);
    if (schedRows.length === 0) return res.json([]);
    const scheduleId = schedRows[0].id;

    // Check for overrides first
    const { rows: overrideRows } = await db.query('SELECT * FROM availability_overrides WHERE schedule_id = $1 AND override_date = $2', [scheduleId, date]);
    
    let availability;
    if (overrideRows.length > 0) {
      availability = overrideRows[0];
    } else {
      const { rows: availRows } = await db.query('SELECT * FROM availability WHERE schedule_id = $1 AND day_of_week = $2', [scheduleId, dayOfWeek]);
      if (availRows.length > 0) availability = availRows[0];
    }

    if (!availability || !availability.is_available) return res.json([]); // No slots available

    // 3. Generate slots
    const slots = [];
    let currentSlotStart = new Date(`${date}T${availability.start_time}`);
    const endOfDayAvail = new Date(`${date}T${availability.end_time}`);

    const slotInterval = eventType.duration_minutes; // Can also be arbitrary

    while (addMinutes(currentSlotStart, slotInterval) <= endOfDayAvail) {
      if (!isBefore(currentSlotStart, new Date())) { // ignore past slots
        slots.push({
          time: format(currentSlotStart, 'HH:mm'),
          datetime: currentSlotStart.toISOString(),
          available: true
        });
      }
      currentSlotStart = addMinutes(currentSlotStart, slotInterval); 
    }

    // 4. Filter out booked slots
    const { rows: bookedRows } = await db.query(`
      SELECT start_time, end_time, e.buffer_before_minutes, e.buffer_after_minutes FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE b.status = 'confirmed' 
      AND b.start_time >= $1 AND b.start_time < $2
    `, [startOfDay(targetDate).toISOString(), endOfDay(targetDate).toISOString()]); // All bookings for that day

    const availableSlots = slots.filter(slot => {
      const slotStart = new Date(slot.datetime);
      const slotEnd = addMinutes(slotStart, eventType.duration_minutes);

      // Add buffers to the candidate slot
      const candidateStart = addMinutes(slotStart, -eventType.buffer_before_minutes);
      const candidateEnd = addMinutes(slotEnd, eventType.buffer_after_minutes);

      const isBooked = bookedRows.some(booking => {
        const bStart = addMinutes(new Date(booking.start_time), -booking.buffer_before_minutes);
        const bEnd = addMinutes(new Date(booking.end_time), booking.buffer_after_minutes);
        // Overlap logic: candidateStart < bEnd AND candidateEnd > bStart
        return (candidateStart < bEnd && candidateEnd > bStart);
      });
      return !isBooked;
    });

    res.json(availableSlots);
  } catch (err) {
    next(err);
  }
};
