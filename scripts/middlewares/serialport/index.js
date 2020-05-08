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
  let lineBuffer = [];

  const port = new SerialPort(portConfig.path, {
    baudRate: parseInt(portConfig.baudRate, 10),
    dataBits: parseInt(portConfig.dataBits, 10),
    stopBits: parseInt(portConfig.stopBits, 10),
    parity: portConfig.parity,
    autoOpen: true,
  });

  // port.on('open', () => {
  // });
  port.on('error', (error) => {
    console.error(chalk.red(error.message));
    console.error(error.stack);
  });
  port.on('close', () => {
    console.error(chalk.red('Port closed?'));
  });

  const parser = port.pipe(new Readline({ delimiter: '\n' }));

  parser.on('data', (line) => {
    lineBuffer.push(line);
  });

  return (req, res) => {
    res.json(lineBuffer);
    lineBuffer = [];
  };
};

module.exports = getSerialportMiddleware;
