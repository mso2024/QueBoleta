const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; 

function verifyRole(role) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      console.log('Token decodificado:', decoded);
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
      }

      if (decoded.rol !== role) {
        return res.status(403).json({ error: 'Access denied. You do not have the necessary role.' });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = verifyRole;
