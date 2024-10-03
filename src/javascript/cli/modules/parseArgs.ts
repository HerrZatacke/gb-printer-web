/* eslint-disable @typescript-eslint/ban-ts-comment */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface Args {
  channels: string[],
  input: string,
  output: string,
  bracketSize: number,
  scaleFactor: number,
}

export const parseArgs = (): Args => {
  const argv = yargs(hideBin(process.argv))
    .option('channels', {
      alias: 'c',
      describe: 'Order of channels',
      default: ['r', 'g', 'b'],
      choices: ['r', 'g', 'b', 'n'],
      array: true,
    })
    .option('input', {
      alias: 'i',
      describe: 'Input file',
      string: true,
    })
    .option('output', {
      alias: 'o',
      describe: 'Output folder',
      string: true,
      default: '.',
    })
    .option('bracketsize', {
      alias: 'b',
      describe: 'Number of AEB brackets',
      number: true,
      default: 5,
    })
    .option('scalefactor', {
      alias: 's',
      describe: 'Scale output images by [s]',
      number: true,
      default: 4,
    })
    .demandOption(['i', 'b'])
    .help('h')
    .parse();

  return {
    // @ts-ignore
    bracketSize: argv.bracketsize,
    // @ts-ignore
    channels: argv.channels,
    // @ts-ignore
    input: argv.input,
    // @ts-ignore
    output: argv.output,
    // @ts-ignore
    scaleFactor: argv.scalefactor,
  };
};
