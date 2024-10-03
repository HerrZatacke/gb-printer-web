import type { ChannelKey } from 'gb-image-decoder';
import type { RGBNBrackets, RGBNImportItem } from './rgbToCanvas';
import type { ImportItem } from '../../../types/ImportItem';


export const rgbnBracketToImages = (rgbnBrackets: RGBNBrackets): RGBNImportItem[] => {

  const result: RGBNImportItem[] = [];

  Object.entries(rgbnBrackets)
    .forEach(([channel, items]) => {
      const channelKey = channel as ChannelKey;

      items.forEach((item: ImportItem, index: number) => {
        result[index] = result[index] || {};
        result[index][channelKey] = item;
      });

    });

  return result;

};
