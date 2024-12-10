const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');
const { server } = require('typescript');

router.get('/top_sale_ranks', async(req, res) =>{
    try{
        const query = 'SELECT eventos.nombre, (SELECT COUNT(*) FROM entradas JOIN tipo_boletas ON entradas.ticket_id = tipo_boletas.ticket_id WHERE tipo_boletas.date_id IN(SELECT fechas.date_id FROM fechas WHERE fechas.event_id = eventos.event_id)) AS boletas_vendidas FROM eventos ORDER BY boletas_vendidas DESC';   
        const [results] = await db.execute(query);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error'});

    }
});

router.get('/getComentarios/:user_id', async (req, res) =>{
    const { user_id } = req.params;
    try{
        const query = `
            SELECT 
            usuarios.nombre AS nombrecomentador,
            eventos.nombre AS eventname,
            comentarios_calificaciones.contenido AS contenidocomentario,
            comentarios_calificaciones.calificacion AS calificacion
            FROM eventos 
            JOIN organizador_evento 
                ON eventos.event_id = organizador_evento.event_id 
            JOIN comentarios_calificaciones 
                ON eventos.event_id = comentarios_calificaciones.event_id
            JOIN usuarios 
                ON comentarios_calificaciones.user_id = usuarios.user_id WHERE organizador_evento.user_id = ?`;
        const [results] = await db.execute(query,[user_id]);
        res.status(200);


    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.get('/getEntradasTotales/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    try{
        const query = `
            SELECT eventos.nombre AS eventonombre, COUNT(id_entrada) AS entradastot
            FROM entradas JOIN tipo_boletas 
            ON entradas.ticket_id = tipo_boletas.ticket_id 
            JOIN fechas 
            ON tipo_boletas.date_id = fechas.date_id
            JOIN eventos ON fechas.event_id = eventos.event_id 
            JOIN organizador_evento 
            ON eventos.event_id = organizador_evento.event_id
            WHERE organizador_evento.user_id = ?
            GROUP BY eventos.nombre`;
        const [results] = await db.execute(query,[user_id]);
        res.status(200);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.get('/getIngresosTotales/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    try{
        const query = `
        SELECT SUM(monto) AS ingresos
        FROM recibos 
        JOIN entradas 
            ON recibos.id_entrada = entradas.id_entrada
        JOIN tipo_boletas 
            ON tipo_boletas.ticket_id = entradas.ticket_id
        JOIN fechas
            ON fechas.date_id = tipo_boletas.date_id
        JOIN eventos
            ON fechas.event_id = eventos.event_id
        JOIN organizador_evento 
            ON eventos.event_id = organizador_evento.event_id
        WHERE organizador_evento.user_id = ?`;
        const [results] = await db.execute(query,[user_id]);
        res.status(200);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

module.exports = router;

