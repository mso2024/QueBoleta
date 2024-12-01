const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 
const jwt = require('jsonwebtoken');


router.get('/getTicketDetails/:ticket_id', async (req, res) =>{
    const {ticket_id} = req.params;
    try{
        const query = 'SELECT * FROM tipo_boletas WHERE ticket_id = ?';
        const [results] = await db.execute(query,[ticket_id]);
        res.status(200).json(results);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error'});
    }
});

router.post('/checkout/:ticket_id/:user_id', async (req, res) =>{
    const {user_id,ticket_id} = req.params;
    try{
        //Obtengo el precio de la boleta
        const [tiquete]  = await db.execute('SELECT precio FROM tipo_boletas WHERE ticket_id = ?',[ticket_id]);
        if(tiquete.lenght === 0){
            return res.status(404).json({message: 'Tiquete no encontrado'});
        }
        const precio = tiquete[0].precio;

        //Obtengo usuario para obtener su saldo y lo comparo con el precio de la boleta para ver si le alcanza
        const [usuario] = await db.execute('SELECT balance FROM usuarios WHERE user_id = ?',[user_id]);
        if(usuario.lenght === 0){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        const balance_usuario = usuario[0].balance;
        if(balance_usuario < precio){
            return res.status(400).json({message: 'Fondos insuficientes. Por favor recargue.'});
        }

        //Creo la entrada y actualizo el balance del usuario (le resto el precio de la boleta)
        const query = 'INSERT INTO entradas(ticket_id,id_cliente) VALUES (?,?)'
        const [result] = await db.execute(query,[ticket_id,user_id]);
        if(result.affectedRows > 0){
            await db.execute('UPDATE usuarios SET balance = balance - ? WHERE user_id = ?',[precio, user_id]);
            res.status(200).json({message: 'Compra exitosa.'});
        } 
        else{
            res.status(404).json({message: 'Error'});
        }
    }catch(error){
        console.error(error);
        res.status(500).json(error);
    }
});


