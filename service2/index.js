const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const verifyTokenAndRole = require('./shared/verifyToken');

const options = {
  key: fs.readFileSync('./certs/service2.key'),
  cert: fs.readFileSync('./certs/service2.crt'),

};

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
app.use(express.json());

app.get('/op4', verifyTokenAndRole('op4'), (req, res) => {
  res.json({ message: 'Operation 4 success from Service 2' });
});

app.get('/op5', verifyTokenAndRole('op5'), (req, res) => {
  res.json({ message: 'Operation 5 success from Service 2' });
});

https.createServer(options, app).listen(5002, () => {
  console.log('Service 2 running with TLS on port 5002');
});
