const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db/connection'); 

const secretKey = 'your_secret_key'; 

router.post('/register', async (req, res) => {
  const { nombre, apellido, balance, rol, email, pwd } = req.body;  // Cambié 'password' por 'pwd'

  if (!nombre || !apellido || !rol || !email || !pwd || (balance === undefined || isNaN(balance))) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios y balance debe ser un número válido' });
  }

  try {
    // Verificar si el email ya está registrado
    const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(pwd, 10);  // Usamos 'pwd' aquí también

    // Insertar el nuevo usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, apellido, balance, rol, email, pwd) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, balance, rol, email, hashedPassword]
    );

    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



router.post('/login', async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, rol: user.rol },
      secretKey,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ message: 'Login successful', token, user_id: user.user_id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
