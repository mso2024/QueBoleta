const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');


router.get('/categories/:cat_name', async (req, res) =>{
  const {cat_name} = req.params;
  try{
    const query = 'SELECT DISTINCT eventos.nombre, eventos.descripcion FROM eventos JOIN categorias_eventos ON eventos.event_id = categorias_eventos.event_id JOIN categorias ON categorias_eventos.cat_id = categorias.cat_id WHERE categorias.nombre = ?'
    const [results] = await db.execute(query,[cat_name]);
    res.status(200).json(results);
  } catch(error){
    console.error(error);
    res.status(500).json({message: 'Error'});
  }


});


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nombre, descripcion FROM eventos;
    
    `);
    res.json(rows);  
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/schedule', verifyRole('Organizador'), async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad } = req.body;

  if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !ubicacion || !capacidad) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO eventos (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    
    const event_id = result.insertId;

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

router.get('/events/:event_name', async (req, res) => {
  const event_name = decodeURIComponent(req.params.event_name);  // Decode the event name
  console.log('Received event name:', event_name);  // Log the event name to check if it's correct
  
  try {
    const query = 'SELECT fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion FROM fechas JOIN eventos ON fechas.event_id = eventos.event_id WHERE eventos.nombre = ?';
    const [results] = await db.execute(query, [event_name]);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event dates' });
  }
});

module.exports = router;
