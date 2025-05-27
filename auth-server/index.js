const https = require('https');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /^https?:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors(corsOptions));




app.use(bodyParser.json());

const options = {
  key: fs.readFileSync('./certs/auth-server.key'),
  cert: fs.readFileSync('./certs/auth-server.crt'),
  // ca: fs.readFileSync('./shared/certs/ca.pem'),  // trust this CA
};


// In-memory users DB example:
const users = {
  alice: { password: 'password123', role: 'admin' },
  bob: { password: 'password456', role: 'manager' },
  eve: { password: 'password789', role: 'user' },
};

// Store session keys per user (in-memory for demo)
const sessions = {};

// Generate RSA keypair function (2048-bit)
function generateKeyPair() {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
      if (err) reject(err);
      else resolve(keypair);
    });
  });
}

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate RSA keypair for this user session
  try {
    const keypair = await generateKeyPair();
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

    // Store keys in session
    sessions[username] = { privateKeyPem, publicKeyPem, role: user.role };

    // Prepare JWT payload
    const payload = {
      user: username,
      role: user.role,
      iss: 'auth-server',
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
    };

    // Sign JWT with private key (using RS256)
    const token = jwt.sign(payload, privateKeyPem, { algorithm: 'RS256' });

    // Send token and public key to client
    res.json({
      token,
      publicKey: publicKeyPem,
      role: user.role,
    });
  } catch (error) {
    console.error('Error generating keys:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Assuming `sessions` is accessible here — same as in your /login route
app.get('/public-key/:username', (req, res) => {
  const username = req.params.username;

  if (!sessions[username] || !sessions[username].publicKeyPem) {
    return res.status(404).json({ message: 'Public key not found' });
  }

  const publicKey = sessions[username].publicKeyPem;
  res.json({ publicKey });
});

https.createServer(options, app).listen(4000, () => {
  console.log('Service 1 running with TLS on port 4000');
});