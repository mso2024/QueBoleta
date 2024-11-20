const express = require('express');
const router = express.Router();
const db = require('../db/connection');  // Your database connection

// Endpoint to fetch events
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.event_id, 
        e.nombre AS event_name, 
        e.descripcion AS event_description, 
        f.fecha_hora_inicio AS start_time, 
        f.fecha_hora_fin AS end_time, 
        f.ubicacion AS location
      FROM eventos e
      LEFT JOIN fechas f ON e.event_id = f.event_id
      ORDER BY f.fecha_hora_inicio ASC
    `);
    res.json(rows);  // Return events as JSON
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
