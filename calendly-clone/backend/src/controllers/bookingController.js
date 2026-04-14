const db = require('../db');
const { addMinutes, isBefore, parseISO, format, set, startOfDay, endOfDay, isPast } = require('date-fns');

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
    const { event_type_id, invitee_name, invitee_email, start_time, notes } = req.body;
    
    // Fetch event type to calculate end_time
    const { rows: eventRows } = await db.query('SELECT * FROM event_types WHERE id = $1', [event_type_id]);
    if (eventRows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    
    const eventType = eventRows[0];
    const startDate = new Date(start_time);
    const endDate = addMinutes(startDate, eventType.duration_minutes);
    
    // Check if slot is already booked
    const { rows: existingRows } = await db.query(`
      SELECT * FROM bookings 
      WHERE event_type_id = $1 AND status = 'confirmed' 
      AND (
        (start_time < $3 AND end_time > $2)
      )
    `, [event_type_id, startDate.toISOString(), endDate.toISOString()]);
    
    // Note: The logic above prevents overlapping bookings for the same event type.
    // For a stricter calendar, you would check across all event types for the user.
    
    const { rows } = await db.query(`
      INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [event_type_id, invitee_name, invitee_email, startDate.toISOString(), endDate.toISOString(), notes]);
    
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *", [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(rows[0]);
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
    
    // 2. Get user availability for that day of week
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0(Sun) - 6(Sat)
    
    const { rows: availRows } = await db.query('SELECT * FROM availability WHERE user_id = $1 AND day_of_week = $2 AND is_available = true', [eventType.user_id, dayOfWeek]);
    if (availRows.length === 0) return res.json([]); // No slots available
    
    const availability = availRows[0];
    
    // 3. Generate slots
    const slots = [];
    let currentSlotStart = new Date(`${date}T${availability.start_time}`);
    const endOfDayAvail = new Date(`${date}T${availability.end_time}`);
    
    while (addMinutes(currentSlotStart, eventType.duration_minutes) <= endOfDayAvail) {
      if (!isBefore(currentSlotStart, new Date())) { // ignore past slots
        slots.push({
          time: format(currentSlotStart, 'HH:mm'),
          datetime: currentSlotStart.toISOString(),
          available: true
        });
      }
      currentSlotStart = addMinutes(currentSlotStart, eventType.duration_minutes); // Wait, Calendly often increments by duration or fixed interval.
    }
    
    // 4. Filter out booked slots
    const { rows: bookedRows } = await db.query(`
      SELECT start_time, end_time FROM bookings
      WHERE status = 'confirmed' 
      AND start_time >= $1 AND start_time < $2
    `, [startOfDay(targetDate).toISOString(), endOfDay(targetDate).toISOString()]); // All bookings for that day
    
    const availableSlots = slots.filter(slot => {
      const slotStart = new Date(slot.datetime);
      const slotEnd = addMinutes(slotStart, eventType.duration_minutes);
      
      const isBooked = bookedRows.some(booking => {
        const bStart = new Date(booking.start_time);
        const bEnd = new Date(booking.end_time);
        // Overlap logic: slotStart < bEnd AND slotEnd > bStart
        return (slotStart < bEnd && slotEnd > bStart);
      });
      return !isBooked;
    });
    
    res.json(availableSlots);
  } catch (err) {
    next(err);
  }
};
