const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile('index.html')
});

server.listen(8080, () => {
  console.log('listening on port 8080');
});