const https = require('https');
const fs = require('fs');
const credentials = {
  key: fs.readFileSync('./shared/certs/key.pem'),
  cert: fs.readFileSync('./shared/certs/cert.pem'),
};
const express = require('express');
const cors = require('cors');
const verifyTokenAndRole = require('./shared/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/op4', verifyTokenAndRole('op4'), (req, res) => {
  res.json({ message: 'Operation 4 success from Service 2' });
});

app.get('/op5', verifyTokenAndRole('op5'), (req, res) => {
  res.json({ message: 'Operation 5 success from Service 2' });
});

https.createServer(credentials, app).listen(5002, () => {
  console.log('Service 1 running with TLS on port 5002');
});
