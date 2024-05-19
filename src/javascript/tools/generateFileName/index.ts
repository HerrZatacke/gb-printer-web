import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RGBNPalette } from 'gb-image-decoder';
import { dateFormat, dateFormatFilename } from '../../app/defaults';
import { Image } from '../../../types/Image';
import { Palette } from '../../../types/Palette';

dayjs.extend(customParseFormat);

const joinNonNullish = (parts: string[], sep = '-'): string => (
  parts.reduce((acc: string, part: string): string => (
    part ? `${acc}${acc ? sep : ''}${part}` : acc
  ), '')
);

const rgbnPaletteName = ({ r, g, b, n }: RGBNPalette): string => {

  const hex = (val: number) => (val.toString(16)).padStart(2, '0');

  return joinNonNullish([
    r?.map(hex).join('') || '',
    g?.map(hex).join('') || '',
    b?.map(hex).join('') || '',
    n?.map(hex).join('') || '',
  ], '.');
};

interface FileNameOptionsBase {
  image?: Image,
  palette?: Palette | RGBNPalette,
  exportScaleFactor?: number,
  useCurrentDate?: boolean,
  frameRate?: number,
  frameName?: string,
  paletteShort?: string,
  altTitle?: string,
}

interface FileNameOptionsImages extends FileNameOptionsBase {
  image: Image,
  palette: Palette | RGBNPalette,
  exportScaleFactor?: number,
}

interface FileNameOptionsAnimated extends FileNameOptionsBase {
  useCurrentDate: boolean,
  exportScaleFactor: number,
  frameRate: number,
  altTitle: string,
  frameName: string,
  paletteShort: string,
}

interface FileNameOptionsZipDownload extends FileNameOptionsBase {
  useCurrentDate: boolean,
  altTitle: string,
}

export type FileNameOptions = FileNameOptionsImages | FileNameOptionsAnimated | FileNameOptionsZipDownload;

const generateFileName = (options: FileNameOptions): string => {

  const image = options.image || null;
  const palette = options.palette || null;
  const exportScaleFactor = options.exportScaleFactor || null;
  const useCurrentDate = options.useCurrentDate || null;

  const frameRate = options.frameRate?.toString(10) || '';
  const altTitle = options.altTitle || '';
  const frameName = options.frameName || '';
  const paletteShort = options.paletteShort || '';


  const date = (useCurrentDate || !image) ? dayjs() : dayjs(image.created, dateFormat);
  const formattedDate = date.isValid() ? date.format(dateFormatFilename) : '';

  const paletteName = paletteShort ||
    (palette ? ((palette as Palette).shortName || rgbnPaletteName(palette as RGBNPalette)) : '');

  return joinNonNullish([
    formattedDate,
    image && image.title ? image.title : altTitle,
    exportScaleFactor ? `${exportScaleFactor}x` : '',
    frameRate ? `${frameRate}fps` : '',
    frameName,
    paletteName,
  ]);
};

export default generateFileName;
