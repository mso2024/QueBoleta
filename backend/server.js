const express = require('express');
const cors = require('cors');
const routes = require('./routes/index'); // Import your routes

const app = express();
const PORT = 5000;

// Enable CORS for the Angular frontend
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json()); // Parse incoming JSON requests

// Use the routes from your routes/index.js
app.use('/api', routes);  // This will route /api/eventos to the eventos router

// A simple test route for debugging
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
