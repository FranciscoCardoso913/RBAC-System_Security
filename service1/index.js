const express = require('express');
const cors = require('cors');
const verifyTokenAndRole = require('./shared/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/op1', verifyTokenAndRole('op1'), (req, res) => {
  res.json({ message: 'Operation 1 success from Service 1' });
});

app.post('/op2', verifyTokenAndRole('op2'), (req, res) => {
  res.json({ message: 'Operation 2 success from Service 1' });
});

app.get('/op3', verifyTokenAndRole('op3'), async (req, res) => {
  // Suppose this calls Service 2
  try {
    // const fetch = await import('node-fetch');
    const response = await fetch('http://service2:5002/op5', {
      method: 'GET',
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    if (!response.ok) throw new Error('Service 2 rejected the call');

    const data = await response.json();
    res.json({ message: 'Operation 3 + nested op5 success', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in op3 or calling Service 2' });
  }
});

app.listen(5001, () => {
  console.log('Service 1 running on port 3000');
});
