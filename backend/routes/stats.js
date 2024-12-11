const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');

router.get('/getAllComentarios', verifyRole('Administrador'), async (req, res) =>{
    try{
        const query = 'SELECT * FROM comentarios_calificaciones';
        const [results] = await db.execute(query);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.delete('/deleteComentario/:exp_id', verifyRole('Administrador'), async (req, res) => {
    const { exp_id } = req.params; // Extraemos el id del comentario de los parámetros de la URL
    try {
        const query = 'DELETE FROM comentarios_calificaciones WHERE exp_id = ?';
        const [results] = await db.execute(query, [exp_id]); // Ejecutamos la consulta con el parámetro
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        res.status(200).json({ message: 'Comentario eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el comentario' });
    }
});

router.delete('/deleteUsuario/:user_id', verifyRole('Administrador'), async (req, res) => {
    const { user_id } = req.params; // Extraemos el id del usuario de los parámetros de la URL
    try {
        // Primero, podemos verificar si el usuario tiene entradas o recibos, para evitar la eliminación si hay datos relacionados
        const checkQuery = 'SELECT COUNT(*) AS related_entries FROM entradas WHERE id_cliente = ?';
        const [checkResults] = await db.execute(checkQuery, [user_id]);

        if (checkResults[0].related_entries > 0) {
            return res.status(400).json({ message: 'El usuario tiene entradas asociadas. No se puede eliminar.' });
        }

        // Si no tiene entradas, eliminamos el usuario
        const query = 'DELETE FROM usuarios WHERE user_id = ?';
        const [results] = await db.execute(query, [user_id]); // Ejecutamos la consulta con el parámetro
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

router.get('/getAllUsuarios', verifyRole('Administrador'), async (req, res) => {
    try{
        const query = 'SELECT user_id,nombre,apellido,balance,rol,email FROM usuarios';
        const [results] = await db.execute(query);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.get('/getMostActiveUsers', verifyRole('Administrador'), async (req, res) => {
    try{
        const query = `
        SELECT u.user_id, u.nombre, u.apellido, COUNT(r.id_recibo) AS cantidad_recibos
        FROM usuarios u
        JOIN entradas e ON u.user_id = e.id_cliente
        JOIN recibos r ON e.id_entrada = r.id_entrada
        GROUP BY u.user_id
        ORDER BY cantidad_recibos DESC`;
        const [results] = await db.execute(query);
        res.status(200).results(json);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

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

router.get('/getComentarios/:user_id', verifyRole('Organizador'), async (req, res) =>{
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

router.get('/getEntradasTotales/:user_id', verifyRole('Organizador'), async (req, res) =>{
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

router.get('/getIngresosTotales/:user_id', verifyRole('Organizador'), async (req, res) =>{
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

