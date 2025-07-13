import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import filenamify from 'filenamify/browser';
import type { RGBNPalette } from 'gb-image-decoder';
import { FileNameStyle } from '@/consts/fileNameStyles';
import type { Image } from '@/types/Image';
import type { Palette } from '@/types/Palette';

dayjs.extend(customParseFormat);

const joinTruthy = (parts: string[], sep = '-'): string => (
  parts.reduce((acc: string, part: string): string => (
    part ? `${acc}${acc ? sep : ''}${part}` : acc
  ), '')
);

const rgbnPaletteName = ({ r, g, b, n }: RGBNPalette): string => {

  const hex = (val: number) => (val.toString(16)).padStart(2, '0');

  return joinTruthy([
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
  fileNameStyle: FileNameStyle,
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

  const { fileNameStyle } = options;


  const date = (useCurrentDate || !image?.created) ? dayjs() : dayjs(new Date(image.created));
  const formattedDate = date.isValid() ? date.format('YYYYMMDD-HHmmss') : '';

  const paletteName = paletteShort ||
    (palette ? ((palette as Palette).shortName || rgbnPaletteName(palette as RGBNPalette)) : '');

  const title = image && image.title ? image.title : altTitle;

  const scaleFactor = exportScaleFactor ? `${exportScaleFactor}x` : '';

  const fps = frameRate ? `${frameRate}fps` : '';

  let parts: string[];

  switch (fileNameStyle) {
    case FileNameStyle.TITLE_ONLY:
      parts = [title];
      break;

    case FileNameStyle.DATE_TITLE:
      parts = [formattedDate, title];
      break;

    case FileNameStyle.FULL:
    default:
      parts = [
        formattedDate,
        title,
        scaleFactor,
        fps,
        frameName,
        paletteName,
      ];
      break;
  }

  const joined = joinTruthy(parts);

  return filenamify(joined, { replacement: '' }) as string;
};

export default generateFileName;
