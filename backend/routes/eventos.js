const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');


router.get('/:cat_name', async (req, res) =>{
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



module.exports = router;
