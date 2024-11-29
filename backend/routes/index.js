const express = require('express');
const router = express.Router();

const eventosRoutes = require('./eventos'); // Import your eventos route
const authRoutes = require('./auth');
const statRoutes = require('./stats');
// Use the /eventos path for event-related routes
router.use('/eventos', eventosRoutes);
router.use('/auth', authRoutes);
router.use('/stats', statRoutes);
module.exports = router;
