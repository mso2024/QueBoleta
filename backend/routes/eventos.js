const express = require('express');
const router = express.Router();
const db = require('../db/connection');  // Your database connection
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');
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

// Create a new event - Accessible only to "Organizador" role
router.post('/schedule', verifyRole('Organizador'), async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad } = req.body;

  // Validate input
  if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !ubicacion || !capacidad) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert new event into the database
    const [result] = await db.query(
      'INSERT INTO eventos (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    
    const event_id = result.insertId;

    // Insert event date
    await db.query(
      'INSERT INTO fechas (event_id, fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion) VALUES (?, ?, ?, ?, ?)',
      [event_id, fecha_inicio, fecha_fin, capacidad, ubicacion]
    );

    res.status(201).json({ message: 'Event scheduled successfully', event_id });
  } catch (error) {
    console.error('Error scheduling event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
