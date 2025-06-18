import { PrinterFunction } from '@/consts/printerFunction';
import type {
  CheckPrinterStatus,
  PrinterCommand,
  PrinterFetchImagesCommand,
  PrinterImages,
  PrinterParams,
  PrinterStatusCommand,
  PrinterTestFile,
  PrinterTestfileCommand,
  RemoteEnv,
  RemotePrinterEvent,
} from '@/types/Printer';
import checkPrinter from './commands/checkPrinter';
import clearPrinter from './commands/clearPrinter';
import fetchImages from './commands/fetchImages';
import testFile from './commands/testFile';

const initCommands = ({ targetWindow }: RemoteEnv, env: string, remoteParams: URLSearchParams) => {
  const commands: PrinterCommand[] = [];

  switch (env) {
    case 'webpack-dev':
      commands.push(
        {
          name: PrinterFunction.TESTFILE,
          fn: testFile,
        },
        {
          name: PrinterFunction.CHECKPRINTER,
          fn: checkPrinter,
        },
        {
          name: PrinterFunction.FETCHIMAGES,
          fn: fetchImages,
        },
        {
          name: PrinterFunction.CLEARPRINTER,
          fn: clearPrinter,
        },
      );
      break;

    case 'esp8266':
      commands.push(
        {
          name: PrinterFunction.CHECKPRINTER,
          fn: checkPrinter,
        },
        {
          name: PrinterFunction.FETCHIMAGES,
          fn: fetchImages,
        },
        {
          name: PrinterFunction.CLEARPRINTER,
          fn: clearPrinter,
        },
      );
      break;

    case 'pico-gb':
      commands.push(
        {
          name: PrinterFunction.CHECKPRINTER,
          fn: checkPrinter,
        },
        {
          name: PrinterFunction.FETCHIMAGES,
          fn: fetchImages,
        },
      );
      break;

    default:
      break;
  }


  window.addEventListener('message', async (event: MessageEvent<RemotePrinterEvent>) => {
    if (event.source !== targetWindow) {
      return;
    }

    const printerCommand = event.data.toRemotePrinter;
    if (!printerCommand) {
      return;
    }

    let fromRemotePrinter: CheckPrinterStatus | PrinterTestFile | PrinterImages | null;

    switch (printerCommand.command) {
      case PrinterFunction.FETCHIMAGES: {
        const commandFn = commands.find(({ name }) => name === printerCommand.command) as PrinterFetchImagesCommand;
        fromRemotePrinter = await commandFn.fn(targetWindow, printerCommand.params as PrinterParams, remoteParams);
        break;
      }

      case PrinterFunction.CLEARPRINTER:
      case PrinterFunction.CHECKPRINTER: {
        const commandFn = commands.find(({ name }) => name === printerCommand.command) as PrinterStatusCommand;
        fromRemotePrinter = await commandFn.fn();
        break;
      }

      case PrinterFunction.TESTFILE: {
        const commandFn = commands.find(({ name }) => name === printerCommand.command) as PrinterTestfileCommand;
        fromRemotePrinter = await commandFn.fn();
        break;
      }

      default:
        fromRemotePrinter = null;
    }

    if (fromRemotePrinter) {
      targetWindow.postMessage({
        fromRemotePrinter,
      } as RemotePrinterEvent, '*');
    }
  });


  return commands;
};

export default initCommands;
