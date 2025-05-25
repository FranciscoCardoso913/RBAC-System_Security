const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Auth-Service');
});

app.listen(4000, () => {
  console.log('Auth-Service running on port 4000');
});
