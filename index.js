'use strict';
const path = require('path');
const http = require('http');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 5000;

const POSTgetFormID = require('./application/api/handlers/POSTgetFormID');
const POSTcreateCheckoutLink = require('./application/api/handlers/POSTcreateCheckoutLink');
const GETgetJSON = require('./application/api/handlers/GETgetJSON');

const routing = {
  '/': '<h1>Welcome to homepage</h1><hr>',
  '/api/create-checkout-link': POSTcreateCheckoutLink(),
  '/api/get-form-id': POSTgetFormID(),
  '/api/get-json': GETgetJSON(),
};

const types = {
  object: JSON.stringify,
  string: (s) => s,
  undefined: () => 'not found',
  function: (fn, req, res) => JSON.stringify(fn(req, res)),
};

const server = http.createServer((req, res) => {
  console.log('|-------- start ---------|');
  console.log(`req.url: ${req.url}`);
  const data = routing[req.url];
  console.log(`data: ${data}`);

  const type = typeof data;
  console.log(`typeof data: ${type}`);

  const serializer = types[type];
  console.log(`serializer: ${serializer}`);

  const result = serializer(data, req, res);

  res.end(result);
  console.log(`result: ${result}`);
  console.log('|-------- end ---------|');
});

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});

server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
