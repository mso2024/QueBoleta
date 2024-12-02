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

    const connection = await db.getConnection(); // Conexión manual para manejar transacciones
    try {
        await connection.beginTransaction();

        // Verificar boleta
        const [tiquete] = await connection.execute(
            'SELECT precio FROM tipo_boletas WHERE ticket_id = ?',
            [ticket_id]
        );
        if (tiquete.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Boleta no encontrada.' });
        }
        const precio = tiquete[0].precio;

        // Verificar usuario y saldo
        const [usuario] = await connection.execute(
            'SELECT balance FROM usuarios WHERE user_id = ?',
            [user_id]
        );
        if (usuario.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const balance_usuario = usuario[0].balance;

        if (balance_usuario < precio) {
            await connection.rollback();
            return res.status(400).json({ message: 'Fondos insuficientes. Por favor recargue su cuenta.' });
        }

        // Insertar entrada y actualizar balance
        const insertQuery = 'INSERT INTO entradas(ticket_id, id_cliente) VALUES (?, ?)';
        const [result] = await connection.execute(insertQuery, [ticket_id, user_id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(500).json({ message: 'Error al procesar la compra.' });
        }

        const updateQuery = 'UPDATE usuarios SET balance = balance - ? WHERE user_id = ?';
        await connection.execute(updateQuery, [precio, user_id]);

        await connection.commit();
        res.status(200).json({ message: 'Compra exitosa.' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error durante la transacción.' });
    } finally {
        connection.release();
    }
});

module.exports = router;