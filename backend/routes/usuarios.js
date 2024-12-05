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

router.get('/getUserTickets/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    try{
        const query = 'SELECT * FROM entradas WHERE id_cliente = ?';
        const [results] = await db.execute(query,[user_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.get('/getUserPaymentMethods/:user_id', async (req, res) =>{
    const {user_id} = req.params;
    
    try{
        const query = 'SELECT * FROM metodos_pago WHERE user_id = ?';
        const [results] = await db.execute(query,[user_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500);
    }
});

router.post('/updateUserBalance/:user_id/:am/:pm', async (req, res) =>{
    const {user_id} = req.params;
    const {am} = req.params;
    const {pm} = req.params;

    try{
        const query = 'UPDATE usuarios SET balance = balance + ? WHERE user_id = ? AND balance + ? >= 0';
        const [results] = await db.execute(query,[am,user_id,am]);
        res.status(200).json(results);

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Problema actualizando el balance.'});
    }

    try{
        const query2 = 'INSERT INTO recibo(payment_method_id,tipo_transaccion,estado_transaccion,monto) VALUES (?,"Recarga","Completada",?)';
        const [results2] = await db.execute(query2,[pm,am]);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Problema creando el recibo.'});
    }
});

module.exports = router;