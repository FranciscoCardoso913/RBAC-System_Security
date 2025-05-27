const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const verifyTokenAndRole = require('./shared/verifyToken');
const options = {
  key: fs.readFileSync('./certs/service1.key'),
  cert: fs.readFileSync('./certs/service1.crt'),
  ca: fs.readFileSync('./shared/certs/ca.pem'),  // trust this CA

};
const app = express();
app.use(cors({
  origin: 'https://localhost:3000', // or '*', for dev only
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json());
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/op1', verifyTokenAndRole('op1'), (req, res) => {
  res.json({ message: 'Operation 1 success from Service 1' });
});

app.post('/op2', verifyTokenAndRole('op2'), (req, res) => {
  res.json({ message: 'Operation 2 success from Service 1' });
});

app.get('/op3', verifyTokenAndRole('op3'), async (req, res) => {
  // Suppose this calls Service 2
  try {
    const httpsAgent = new https.Agent({
            ca: fs.readFileSync(path.join(__dirname, './shared/certs', 'ca.pem')),
            rejectUnauthorized: true,  // <- enforce validation
          });
    // const fetch = await import('node-fetch');
    const response = await fetch('https://service2:5002/op5', {
      method: 'GET',
      headers: {
        Authorization: req.headers.authorization,
      },
      agent: httpsAgent,
    });

    if (!response.ok) throw new Error('Service 2 rejected the call');

    const data = await response.json();
    res.json({ message: 'Operation 3 + nested op5 success', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in op3 or calling Service 2' });
  }
});

https.createServer(options, app).listen(5001, () => {
  console.log('Service 1 running with TLS on port 5001');
});
