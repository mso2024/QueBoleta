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

router.get('/tickets/:event_name/:date_id', async (req, res) => {
  const { event_name, date_id } = req.params;
  try {
    const query = 'SELECT * FROM tipo_boletas JOIN fechas ON tipo_boletas.date_id = fechas.date_id JOIN eventos ON fechas.event_id = eventos.event_id WHERE eventos.nombre = ? AND fechas.date_id = ?';
    const [result] = await db.execute(query, [event_name, date_id]);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'No ticket types found for this event on the specified date.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving ticket types.' });
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

router.post('/addTicketType/:date_id', verifyRole('Organizador'), async (req, res) => {
  const { date_id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || !descripcion || !precio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, descripcion, precio' });
  }

  try {
      const query = `
          INSERT INTO tipo_boletas (date_id, nombre, descripcion, precio)
          VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute(query, [date_id, nombre, descripcion, precio]);
      res.status(201).json({ message: 'Tipo de boleto agregado exitosamente', ticket_id: result.insertId });
  } catch (error) {
      console.error('Error al agregar tipo de boleto:', error);
      res.status(500).json({ error: 'Error al agregar tipo de boleto' });
  }
});

router.post('/addEvent', verifyRole('Organizador'), async (req, res) => {
  const { nombre, descripcion, userId } = req.body; // Ahora el userId se recibe en el cuerpo de la solicitud.

  if (!nombre || !descripcion || !userId) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, descripcion y userId' });
  }

  try {
    // 1. Crear el evento
    const query = 'INSERT INTO eventos (nombre, descripcion) VALUES (?, ?)';
    const [result] = await db.execute(query, [nombre, descripcion]);

    // 2. Crear la relación en la tabla organizador_evento
    const eventId = result.insertId;
    const insertOrganizerQuery = 'INSERT INTO organizador_evento (user_id, event_id) VALUES (?, ?)';
    await db.execute(insertOrganizerQuery, [userId, eventId]);

    res.status(201).json({ message: 'Evento agregado y asociado correctamente', event_id: eventId });
  } catch (error) {
    console.error('Error al agregar evento:', error);
    res.status(500).json({ error: 'Error al agregar evento' });
  }
});

router.get('/getTicketTypesbyEventName/:nombre', async (req, res) =>{
  const { nombre } = req.params;
  try{
    const query = `
    SELECT eventos.nombre AS nombre_ev, tipo_boletas.descripcion AS descripcion, tipo_boletas.nombre AS nombre, tipo_boletas.precio AS precio
    FROM tipo_boletas JOIN fechas 
    ON tipo_boletas.date_id = fechas.date_id
    JOIN eventos 
    ON fechas.event_id = eventos.event_id
    WHERE eventos.nombre = ?`;
    const [results] = await db.execute(query,[nombre]);
    res.status(200).json(results);

  }catch(error){
    console.error(error);
    res.status(500);
  }
});

router.post('/addEventDate/:event_id', verifyRole('Organizador'), async (req, res) => {
  const { event_id } = req.params;
  const { fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion } = req.body;

  if (!fecha_hora_inicio || !fecha_hora_fin || !capacidad || !ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios: fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion' });
  }

  try {
      const query = `
          INSERT INTO fechas (event_id, fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion)
          VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute(query, [event_id, fecha_hora_inicio, fecha_hora_fin, capacidad, ubicacion]);
      res.status(201).json({ message: 'Fecha de evento agregada exitosamente', date_id: result.insertId });
  } catch (error) {
      console.error('Error al agregar fecha de evento:', error);
      res.status(500).json({ error: 'Error al agregar fecha de evento' });
  }
});

router.get('/events/:event_name', async (req, res) => {
  const event_name = decodeURIComponent(req.params.event_name); // Decode the event name
  console.log(`[DEBUG] Received event_name: ${event_name}`); // Log the received parameter

  try {
    // Log the query and the parameter to verify correctness
    const query = `
      SELECT 
        fecha_hora_inicio, 
        fecha_hora_fin, 
        capacidad, 
        ubicacion,
        date_id 
      FROM fechas 
      JOIN eventos ON fechas.event_id = eventos.event_id 
      WHERE eventos.nombre = ?`;
    console.log(`[DEBUG] Executing query: ${query} with parameter: ${event_name}`);

    // Execute the query
    const [results] = await db.execute(query, [event_name]);
    console.log(`[DEBUG] Query results: ${JSON.stringify(results)}`); // Log the query results

    if (results.length === 0) {
      console.log(`[DEBUG] No results found for event_name: ${event_name}`);
      return res.status(404).json({ message: 'No data found for the specified event.' });
    }

    // Respond with the results
    res.status(200).json(results);
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error(`[ERROR] Error fetching event dates for event_name: ${event_name}`, error);
    res.status(500).json({ message: 'Internal server error while fetching event dates.' });
  }
});

module.exports = router;
