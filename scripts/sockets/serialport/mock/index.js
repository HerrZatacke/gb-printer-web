const chalk = require('chalk');
const image = require('./image');

const mock = (sendMessage) => {
  let isMocking;

  const concatImage = image.reduce((acc, { timestamp, command }) => {
    let currentLline = acc.find((line) => line.timestamp === timestamp);

    if (!currentLline) {
      currentLline = { timestamp, command };
      acc.push(currentLline);
    } else {
      currentLline.command = `${currentLline.command}\n${command}`;
    }

    return acc;
  }, []);

  return () => {
    if (isMocking) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('Mock stream already running'));
      return;
    }

    isMocking = true;

    concatImage.forEach(({ timestamp, command }, index) => {
      global.setTimeout(() => {

        sendMessage(command);

        if (index + 1 === concatImage.length) {
          isMocking = false;
        }
      }, timestamp);
    });

  };
};

module.exports = mock;
