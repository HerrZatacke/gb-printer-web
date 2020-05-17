const WebSocketServer = require('ws').Server;

const mock = require('./mock');
const openPorts = require('./openPorts');

const serialportWebsocket = (app) => {

  const webSocketServer = new WebSocketServer({
    port: 3001,
    clientTracking: true,
  });

  const broadcast = (message) => {
    webSocketServer.clients.forEach((client) => {
      try {
        client.send(message);
      } catch (error) {
        console.error(error.message);
        console.error(error.stack);
      }
    });
  };

  const mockFunction = mock(broadcast);

  openPorts(broadcast);

  app.use('/mock', (req, res) => {
    mockFunction();
    res.json('mocking...');
  });
};

module.exports = serialportWebsocket;
