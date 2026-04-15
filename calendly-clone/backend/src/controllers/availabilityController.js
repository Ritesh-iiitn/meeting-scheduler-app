const db = require('../db');

exports.getAvailability = async (req, res, next) => {
  try {
    // Assuming default user_id = 1
    const { rows: schedules } = await db.query('SELECT * FROM availability_schedules WHERE user_id = $1 ORDER BY is_default DESC', [1]);
    
    if (schedules.length === 0) return res.json([]);
    
    const scheduleId = schedules[0].id;
    
    const { rows: availability } = await db.query('SELECT * FROM availability WHERE schedule_id = $1 ORDER BY day_of_week', [scheduleId]);
    const { rows: overrides } = await db.query('SELECT * FROM availability_overrides WHERE schedule_id = $1', [scheduleId]);
    
    res.json({
      schedules,
      availability,
      overrides
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { schedule_id, availability, overrides } = req.body; 
    
    // Update regular availability
    if (availability && availability.length > 0) {
      const updatePromises = availability.map((slot) => {
        return db.query(
          `INSERT INTO availability (schedule_id, day_of_week, start_time, end_time, is_available)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (schedule_id, day_of_week) 
           DO UPDATE SET start_time = $3, end_time = $4, is_available = $5`,
          [schedule_id, slot.day_of_week, slot.start_time, slot.end_time, slot.is_available]
        );
      });
      await Promise.all(updatePromises);
    }

    if (overrides && overrides.length > 0) {
      const overridePromises = overrides.map((over) => {
        return db.query(
          `INSERT INTO availability_overrides (schedule_id, override_date, start_time, end_time, is_available)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (schedule_id, override_date) 
           DO UPDATE SET start_time = $3, end_time = $4, is_available = $5`,
          [schedule_id, over.override_date, over.start_time, over.end_time, over.is_available]
        );
      });
      await Promise.all(overridePromises);
    }
    
    res.json({ message: 'Availability updated successfully' });
  } catch (err) {
    next(err);
  }
};
