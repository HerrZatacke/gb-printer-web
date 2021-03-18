import testFile from './commands/testFile';
import checkPrinter from './commands/checkPrinter';
import fetchImages from './commands/fetchImages';
import clearPrinter from './commands/clearPrinter';

const initCommands = ({ targetWindow }, env) => {
  const commands = [];

  switch (env) {
    case 'webpack-dev':
      commands.push({
        name: 'testFile',
        fn: testFile,
      });

    // eslint-disable-next-line no-fallthrough
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

    default:
      break;
  }


  window.addEventListener('message', (event) => {
    if (event.source !== targetWindow) {
      return;
    }

    const { toRemotePrinter: { command } = {} } = event.data;

    const commandFn = commands.find(({ name }) => name === command);

    if (commandFn && typeof commandFn.fn === 'function') {
      commandFn.fn(targetWindow)
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
