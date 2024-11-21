const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db/connection'); // Your database connection

const secretKey = 'your_secret_key'; // Hardcoded secret key (change if needed)

// User registration endpoint
// User registration endpoint
router.post('/register', async (req, res) => {
  const { nombre, apellido, balance, rol, email, pwd } = req.body;

  // Validate input
  if (!nombre || !apellido || !rol || !email || !pwd) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, apellido, balance, rol, email, pwd) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, balance || 0, rol, email, hashedPassword]
    );

    // Debug: Log the result to check for issues
    console.log('Insert result:', result);

    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User login endpoint
router.post('/login', async (req, res) => {
  const { email, pwd } = req.body;

  // Validate input
  if (!email || !pwd) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign(
      { user_id: user.user_id, rol: user.rol },
      secretKey,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
