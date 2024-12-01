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