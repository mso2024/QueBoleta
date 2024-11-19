const express = require('express');
const router = express.Router();

const eventosRoutes = require('./eventos');

router.use('/eventos', eventosRoutes);

module.exports = router;
