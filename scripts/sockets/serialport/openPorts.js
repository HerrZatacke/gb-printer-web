const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const chalk = require('chalk');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const mkdirp = require('mkdirp');

let ports;
try {
  // eslint-disable-next-line global-require,import/no-unresolved
  ports = require('../../../config').ports;
} catch (error) {
  ports = [];
}

const openPorts = (sendMessage) => {

  const dumpDir = path.join(process.cwd(), 'dumps');
  mkdirp.sync(dumpDir);
  const dumpFileName = path.join(dumpDir, `dump-${dayjs().format('YYYY-MM-DD-HH-mm')}.txt`);

  const openPort = (portConfig) => {
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

      if (port.isOpen) {
        port.close();
      }

      if (portConfig.retry) {
        global.setTimeout(() => {
          openPort(portConfig);
        }, portConfig.retry);
      }
    });

    port.on('close', () => {
      console.error(chalk.red('Port closed?'));
      if (portConfig.retry) {
        global.setTimeout(() => {
          openPort(portConfig);
        }, portConfig.retry);
      }
    });

    port.on('open', () => {
      // eslint-disable-next-line no-console
      console.log(chalk.green(`${portConfig.path} opened`));
      parser = port.pipe(new Readline({ delimiter: '\n' }));

      parser.on('data', (line) => {
        fs.appendFileSync(dumpFileName, `${line}\n`, { encoding: 'utf8' });

        if (line.charAt(0) === '#') {
          sendMessage(`# ${portConfig.path} ${line}`);
        } else {
          sendMessage(line);
        }
      });
    });
  };

  [ports].flat().forEach(openPort);
};

module.exports = openPorts;
