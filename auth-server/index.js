const https = require('https');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');

const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

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

};




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
const User = require('./models/User');
const Session = require('./models/Session');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate keypair
    const keypair = await generateKeyPair();
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

    // Store in DB
    await Session.findOneAndUpdate(
      { username },
      { privateKeyPem, publicKeyPem, role: user.role },
      { upsert: true }
    );

    // Create JWT
    const payload = {
      user: username,
      role: user.role,
      iss: 'auth-server',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const token = jwt.sign(payload, privateKeyPem, { algorithm: 'RS256' });

    res.json({ token, publicKey: publicKeyPem, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Assuming `sessions` is accessible here — same as in your /login route
app.get('/public-key/:username', async (req, res) => {
  try {
    const session = await Session.findOne({ username: req.params.username });
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json({ publicKey: session.publicKeyPem });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


https.createServer(options, app).listen(4000, () => {
  console.log('Service 1 running with TLS on port 4000');
});