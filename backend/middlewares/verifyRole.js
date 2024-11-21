const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ensure this matches the key used when generating the token

// Middleware to check user role
function verifyRole(role) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
      }

      // Check if the user's role matches the required role
      if (decoded.rol !== role) {
        return res.status(403).json({ error: 'Access denied. You do not have the necessary role.' });
      }

      // Attach user info to request for later use
      req.user = decoded;
      next();
    });
  };
}

module.exports = verifyRole;
