const express = require('express');
const router = express.Router();

const eventosRoutes = require('./eventos'); // Import your eventos route
const authRoutes = require('./auth');
const statRoutes = require('./stats');
const usuariosRoutes = require('./usuarios');
const checkoutRoutes = require('./facturacion');
// Use the /eventos path for event-related routes
router.use('/eventos', eventosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/auth', authRoutes);
router.use('/stats', statRoutes);
router.use('/facturacion', checkoutRoutes);
module.exports = router;
