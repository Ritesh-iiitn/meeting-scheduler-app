const db = require('../db');

exports.getAllEventTypes = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM event_types ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createEventType = async (req, res, next) => {
  try {
    const { title, slug, duration_minutes, description, color, is_active } = req.body;
    // Assuming default user_id = 1 for admin
    const { rows } = await db.query(
      `INSERT INTO event_types (user_id, title, slug, duration_minutes, description, color, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [1, title, slug, duration_minutes, description, color, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateEventType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, duration_minutes, description, color, is_active } = req.body;
    const { rows } = await db.query(
      `UPDATE event_types
       SET title = $1, slug = $2, duration_minutes = $3, description = $4, color = $5, is_active = $6
       WHERE id = $7 RETURNING *`,
      [title, slug, duration_minutes, description, color, is_active, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteEventType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM event_types WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Event type not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getEventTypeBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query('SELECT * FROM event_types WHERE slug = $1', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
