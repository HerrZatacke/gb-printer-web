import testFile from './commands/testFile';
import checkPrinter from './commands/checkPrinter';
import fetchImages from './commands/fetchImages';
import tear from './commands/tear';
import clearPrinter from './commands/clearPrinter';

const initCommands = ({ targetWindow }, env, remoteParams) => {
  const commands = [];

  switch (env) {
    case 'webpack-dev':
      commands.push(
        {
          name: 'testFile',
          fn: testFile,
        },
        {
          name: 'checkPrinter',
          fn: checkPrinter,
        },
        {
          name: 'fetchImages',
          fn: fetchImages,
        },
        {
          name: 'clearPrinter',
          fn: clearPrinter,
        },
        {
          name: 'tear',
          fn: tear,
        },
      );
      break;

    case 'esp8266':
      commands.push(
        {
          name: 'checkPrinter',
          fn: checkPrinter,
        },
        {
          name: 'fetchImages',
          fn: fetchImages,
        },
        {
          name: 'clearPrinter',
          fn: clearPrinter,
        },
      );
      break;

    case 'pico-gb':
      commands.push(
        {
          name: 'checkPrinter',
          fn: checkPrinter,
        },
        {
          name: 'fetchImages',
          fn: fetchImages,
        },
        {
          name: 'tear',
          fn: tear,
        },
      );
      break;

    default:
      break;
  }


  window.addEventListener('message', (event) => {
    if (event.source !== targetWindow) {
      return;
    }

    const { toRemotePrinter: { command, params } = {} } = event.data;

    const commandFn = commands.find(({ name }) => name === command);

    if (commandFn && typeof commandFn.fn === 'function') {
      commandFn.fn(targetWindow, params, remoteParams)
        .then((fromRemotePrinter) => {
          targetWindow.postMessage({
            fromRemotePrinter,
          }, '*');
        });
    }
  });


  return commands;
};

export default initCommands;
