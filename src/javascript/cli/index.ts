/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';
import chunk from 'chunk';
import type { ChannelKey } from 'gb-image-decoder';
import type { ImportItem } from '../../types/ImportItem';
import type { RGBNBrackets, RGBNImportItem } from './modules/rgbToCanvas';
import type { Args } from './modules/parseArgs';
import { getBanksData } from './modules/getBanksData';
import { getImages } from './modules/getImages';
import { rgbToCanvas } from './modules/rgbToCanvas';
import { mergeCanvases } from './modules/mergeCanvases';
import { parseArgs } from './modules/parseArgs';
import { rgbnBracketToImages } from './modules/rgbnBracketToImages';
import { getFilename } from './modules/getFilename';

const run = async (runOptions: Args) => {

  const inputFileName = runOptions.input;
  const inputName = path.parse(inputFileName).name;
  const outDir = path.join(process.cwd(), runOptions.output);

  // console.log({
  //   outDir,
  //   inputFileName,
  //   inputName,
  //   bracketSize: runOptions.bracketSize,
  //   channels: runOptions.channels,
  //   scaleFactor: runOptions.scaleFactor,
  // });

  const fileContent = await fs.readFile(inputFileName);
  await fs.mkdir(outDir, { recursive: true });

  const banks = await getBanksData(fileContent);

  console.log(`${banks.length} banks`);

  const importItems = (await Promise.all(banks.map(async (bank, bankIndex) => {
    const images: ImportItem[] = await getImages(bank, bankIndex);

    return chunk(images, runOptions.bracketSize)
      .filter((bracket) => bracket.length === runOptions.bracketSize); // remove partial chunks (rest at end of bank)
  }))).flat(2);

  console.log(`${importItems.length} single images`);

  const brackets = chunk(importItems, runOptions.bracketSize);

  console.log(`${brackets.length} brackets`);

  const imagesRaw = chunk(brackets, runOptions.channels.length)
    .filter((imageChannels) => imageChannels.length === runOptions.channels.length); // remove images with too few channels

  console.log(`${imagesRaw.length} raw images`);

  const rgbnBrackets: RGBNBrackets[] = imagesRaw.map((channels) => (
    runOptions.channels.reduce((acc: RGBNBrackets, channelName: string, index: number): RGBNBrackets => ({
      ...acc,
      [channelName as ChannelKey]: channels[index],
    }), {})
  ));

  const images: RGBNImportItem[][] = rgbnBrackets.map(rgbnBracketToImages);


  await Promise.all(images.map(async (imagess: RGBNImportItem[], index) => {
    const average = await mergeCanvases(await Promise.all(imagess.map(rgbToCanvas)));
    await fs.writeFile(path.join(outDir, `${getFilename(inputName, index, runOptions)}.png`), average.toBuffer());
  }));
};


const startTime = Date.now();
console.log(`Start: ${startTime}`);
run(parseArgs())
  .then(() => {
    console.log(`End: ${Date.now()} - ${Date.now() - startTime}ms`);
  });
