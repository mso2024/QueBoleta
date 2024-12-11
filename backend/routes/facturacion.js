const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 

router.get('/getTicketDetails/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    if (!ticket_id || isNaN(ticket_id)) {
        return res.status(400).json({ message: 'ID de boleta inválido.' });
    }

    try {
        const query = 'SELECT * FROM tipo_boletas WHERE ticket_id = ?';
        const [results] = await db.execute(query, [ticket_id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Boleta no encontrada.' });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los detalles de la boleta.' });
    }
});

router.post('/:ticket_id/:user_id', async (req, res) => {
    const { ticket_id, user_id } = req.params;
    if (!ticket_id || !user_id || isNaN(ticket_id) || isNaN(user_id)) {
        return res.status(400).json({ message: 'Parámetros inválidos.' });
    }

    try {
        // Verificar boleta
        const [tiquete] = await db.execute(
            'SELECT precio, date_id FROM tipo_boletas WHERE ticket_id = ?',
            [ticket_id]
        );
        if (tiquete.length === 0) {
            return res.status(404).json({ message: 'Boleta no encontrada.' });
        }
        const precio = tiquete[0].precio;
        const date_id = tiquete[0].date_id;

        // Obtener el event_id asociado con el date_id
        const [fecha] = await db.execute(
            'SELECT event_id FROM fechas WHERE date_id = ?',
            [date_id]
        );
        if (fecha.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }
        const event_id = fecha[0].event_id;

        // Verificar usuario y saldo
        const [usuario] = await db.execute(
            'SELECT balance FROM usuarios WHERE user_id = ?',
            [user_id]
        );
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const balance_usuario = usuario[0].balance;

        if (balance_usuario < precio) {
            return res.status(400).json({ message: 'Fondos insuficientes. Por favor recargue su cuenta.' });
        }

        // Obtener el organizador del evento
        const [organizador] = await db.execute(
            'SELECT user_id FROM organizador_evento WHERE event_id = ?',
            [event_id]
        );
        if (organizador.length === 0) {
            return res.status(404).json({ message: 'No se encontró un organizador para este evento.' });
        }
        const organizador_id = organizador[0].user_id;

        // Insertar la compra de la boleta
        const insertQuery = 'INSERT INTO entradas(ticket_id, id_cliente) VALUES (?, ?)';
        const [result] = await db.execute(insertQuery, [ticket_id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: 'Error al procesar la compra.' });
        }

        // Actualizar balances: restar al comprador y agregar al organizador
        const updateUsuarioQuery = 'UPDATE usuarios SET balance = balance - ? WHERE user_id = ?';
        await db.execute(updateUsuarioQuery, [precio, user_id]);

        const updateOrganizadorQuery = 'UPDATE usuarios SET balance = balance + ? WHERE user_id = ?';
        await db.execute(updateOrganizadorQuery, [precio, organizador_id]);

        res.status(200).json({ message: 'Compra exitosa.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error durante la transacción.' });
    }
});


module.exports = router;