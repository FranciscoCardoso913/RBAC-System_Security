const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Service-1');
});

app.listen(5001, () => {
  console.log('Service-1 running on port 5001');
});
