const express = require('express');
const router = express.Router();

const eventosRoutes = require('./eventos'); // Import your eventos route

// Use the /eventos path for event-related routes
router.use('/eventos', eventosRoutes);

module.exports = router;
