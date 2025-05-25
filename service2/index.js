const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Service-2');
});

app.listen(5002, () => {
  console.log('Service2 running on port 5002');
});
