const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');

router.get('/getUserFunds/:user_id', async (req, res) => {
    const {user_id} = req.params;
    try{
        const query = 'SELECT balance FROM usuarios WHERE user_id = ?';
        const [results] = await db.execute(query,[user_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error'});
    }
});

router.get('/getUserRecibos/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    try{
        const query = 'SELECT * FROM recibos JOIN metodos_pago ON recibos.payment_method_id = metodos_pago.payment_method_id WHERE user_id = ?';
        const [results] =  await db.execute(query,[user_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.get('/getUserTickets/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = `
            SELECT 
                eventos.nombre AS event_nombre, 
                eventos.descripcion AS event_descripcion, 
                tipo_boletas.nombre AS ticket_nombre, 
                entradas.fecha_compra 
            FROM entradas 
            JOIN tipo_boletas ON entradas.ticket_id = tipo_boletas.ticket_id 
            JOIN fechas ON tipo_boletas.date_id = fechas.date_id 
            JOIN eventos ON fechas.event_id = eventos.event_id 
            WHERE entradas.id_cliente = ?`;
        
        const [results] = await db.execute(query, [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching tickets.');
    }
});




router.post('/updateUserBalance/:user_id/:am/:pm', async (req, res) => {
    const { user_id, am, pm } = req.params;

    try {
        // Actualizar el balance del usuario
        const query1 = 'UPDATE usuarios SET balance = balance + ? WHERE user_id = ? AND balance + ? >= 0';
        const [results1] = await db.execute(query1, [am, user_id, am]);

        if (results1.affectedRows === 0) {
            // No se actualizó el balance, probablemente por saldo insuficiente
            return res.status(400).json({ message: 'No se pudo actualizar el balance. Verifique los fondos.' });
        }

        // Insertar un nuevo recibo con la fecha actual (CURRENT_TIMESTAMP)
        const query2 = `
            INSERT INTO recibos (payment_method_id, tipo_transaccion, estado_transaccion, monto, fecha_transaccion) 
            VALUES (?, "Recarga", "Completada", ?, CURRENT_TIMESTAMP)
        `;
        await db.execute(query2, [pm, am]);

        res.status(200).json({ message: 'Balance actualizado y recibo creado exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el balance o crear el recibo.' });
    }
});


router.get('/getUserEvents/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    try{
        const query = 'SELECT eventos.event_id AS eventid, eventos.nombre AS nombre FROM eventos JOIN organizador_evento ON eventos.event_id = organizador_evento.event_id WHERE user_id = ?';
        const [results] = await db.execute(query,[user_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.post('/addPaymentMethod', async (req, res) => {
    const { user_id, no_tarjeta, fecha_exp } = req.body;

    // Verifica que todos los campos estén presentes
    if (!user_id || !no_tarjeta || !fecha_exp) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: user_id, no_tarjeta, fecha_exp' });
    }

    // Completar la fecha con el primer día del mes si falta
    const fechaExpCompleta = `${fecha_exp}-01`; // Convierte '2024-07' a '2024-07-01'

    try {
        const query = `
            INSERT INTO metodos_pago (user_id, no_tarjeta, fecha_exp) 
            VALUES (?, ?, ?)
        `;
        await db.execute(query, [user_id, no_tarjeta, fechaExpCompleta]);

        res.status(201).json({ message: 'Método de pago agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar método de pago:', error);
        res.status(500).json({ error: 'Error al agregar método de pago' });
    }
});

router.get('/getUserPaymentMethods/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = `
            SELECT payment_method_id, no_tarjeta, fecha_exp
            FROM metodos_pago
            WHERE user_id = ?`;
        const [results] = await db.execute(query, [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los métodos de pago.');
    }
});

module.exports = router;