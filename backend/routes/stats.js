const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');
const verifyRole = require('../middlewares/verifyRole');

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

module.exports = router;

