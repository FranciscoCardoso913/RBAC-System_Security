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

app.listen(5002, () => {
  console.log('Service 2 running on port 5000');
});
