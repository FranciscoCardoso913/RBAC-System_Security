const jwt = require('jsonwebtoken');
const roles = require('./roles.json');
const https = require('https');
const fs = require('fs');
const path = require('path');

function verifyTokenAndRole(requiredOp) {
  return async function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.user) throw new Error('Invalid token');

      const username = decoded.user;

      const httpsAgent = new https.Agent({
        ca: fs.readFileSync(path.join(__dirname, './certs', 'ca.pem')),
        rejectUnauthorized: true,  // <- enforce validation
      });
      
      
      
      
      const response = await fetch(`https://auth-server:4000/public-key/${username}`, {
        method: 'GET',
        headers: {
          Authorization: req.headers.authorization,
        },
        agent: httpsAgent,
        
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.statusText}`);
      }

      const { publicKey } = await response.json();

      payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

      const role = payload.role;
      const allowedOps = roles[role] || [];

      if (!allowedOps.includes(requiredOp)) {
        return res.status(403).json({ message: 'Forbidden: Role not allowed' });
      }

      req.user = payload;
      next();
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: 'Token invalid or not authorized' });
    }
  };
}

module.exports = verifyTokenAndRole;
