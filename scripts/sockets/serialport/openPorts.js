const chalk = require('chalk');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

let ports;
try {
  // eslint-disable-next-line global-require,import/no-unresolved
  ports = require('../../../ports.config');
} catch (error) {
  ports = [];
}

const openPorts = (sendMessage) => {
  [ports].flat().forEach((portConfig) => {
    let parser = null;

    // eslint-disable-next-line no-console
    console.log(chalk.cyan(`opening port ${portConfig.path}`));

    const port = new SerialPort(portConfig.path, {
      baudRate: portConfig.baudRate,
      dataBits: portConfig.dataBits,
      stopBits: portConfig.stopBits,
      parity: portConfig.parity,
      autoOpen: true,
    });

    port.on('error', (error) => {
      console.error(chalk.red(error.message));
    });

    port.on('close', () => {
      console.error(chalk.red('Port closed?'));
    });

    port.on('open', () => {
      // eslint-disable-next-line no-console
      console.log(chalk.green(`${portConfig.path} opened`));
      parser = port.pipe(new Readline({ delimiter: '\n' }));

      parser.on('data', (line) => {
        sendMessage(line);
      });
    });
  });
};

module.exports = openPorts;
