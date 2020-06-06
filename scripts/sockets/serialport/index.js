const WebSocketServer = require('ws').Server;

const openPorts = require('./openPorts');

const serialportWebsocket = () => {

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

  openPorts(broadcast);
};

module.exports = serialportWebsocket;
