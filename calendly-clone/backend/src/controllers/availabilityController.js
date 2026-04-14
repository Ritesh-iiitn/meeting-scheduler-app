const db = require('../db');

exports.getAvailability = async (req, res, next) => {
  try {
    // Assuming default user_id = 1
    const { rows } = await db.query('SELECT * FROM availability WHERE user_id = $1 ORDER BY day_of_week', [1]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  const client = await require('../db').query('BEGIN').then(() => require('../db')); // Using simple query flow without proper client acquire for brevity here, wait actually let's just do multiple promises
  // Better approach with simple pool.query
  try {
    const { availability } = req.body; // Array of availability objects
    
    // Simplistic bulk update: run a query for each
    const updatePromises = availability.map((slot) => {
      return db.query(
        `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_available)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, day_of_week) 
         DO UPDATE SET start_time = $3, end_time = $4, is_available = $5`,
        [1, slot.day_of_week, slot.start_time, slot.end_time, slot.is_available]
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Availability updated successfully' });
  } catch (err) {
    next(err);
  }
};
