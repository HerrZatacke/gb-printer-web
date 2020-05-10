const WebSocketServer = require('ws').Server;

const chalk = require('chalk');

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const portConfig = {
  // path: 'COM19',
  path: 'COM12',
  baudRate: '115200',
  dataBits: '7',
  stopBits: '1',
  parity: 'even',
};

const getSerialportMiddleware = () => {

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

  let parser = null;

  const port = new SerialPort(portConfig.path, {
    baudRate: parseInt(portConfig.baudRate, 10),
    dataBits: parseInt(portConfig.dataBits, 10),
    stopBits: parseInt(portConfig.stopBits, 10),
    parity: portConfig.parity,
    autoOpen: true,
  });

  port.on('error', (error) => {
    console.error(chalk.red(error.message));
    console.error(error.stack);
  });

  port.on('close', () => {
    console.error(chalk.red('Port closed?'));
  });

  port.on('open', () => {
    parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (line) => {
      broadcast(line);
    });
  });

  webSocketServer.on('connection', (/* socket */) => {

    // here's listening to a message from the client
    // socket.on('message', (msg) => {
    //   console.log(msg);
    // });

    global.setTimeout(() => {
      broadcast('# this is a fake content');
    }, 4000);
  });

};

module.exports = getSerialportMiddleware;
