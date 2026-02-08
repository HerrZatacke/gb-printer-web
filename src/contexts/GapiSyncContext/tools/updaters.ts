import { updateItems } from '@/contexts/GapiSyncContext/tools/updateItems';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { type ColumnSpec, ColumnType } from '@/tools/sheetConversion/types';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';
import { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';

const imagesCommonProps: ColumnSpec<Image>[] = [
  { prop: 'hash', column: 'Hash', type: ColumnType.STRING },
  { prop: 'created', column: 'Created', type: ColumnType.STRING },
  { prop: 'title', column: 'Title', type: ColumnType.STRING },
  { prop: 'frame', column: 'Frame', type: ColumnType.STRING },
  { prop: 'tags', column: 'Tags', type: ColumnType.JSON },
  { prop: 'lockFrame', column: 'Lock Frame', type: ColumnType.BOOLEAN },
  { prop: 'rotation', column: 'Rotation', type: ColumnType.NUMBER },
  { prop: 'meta', column: 'Meta', type: ColumnType.JSON },
];

export const updateImages = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  images: Image[],
  newLastUpdateValue: number,
) => {
  await updateItems<MonochromeImage>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      ...imagesCommonProps,
      // From Monochrome Image
      { prop: 'palette', column: 'Palette', type: ColumnType.STRING },
      { prop: 'lines', column: 'Lines', type: ColumnType.NUMBER },
      { prop: 'invertPalette', column: 'Invert Palette', type: ColumnType.BOOLEAN },
      { prop: 'framePalette', column: 'Frame Palette', type: ColumnType.STRING },
      { prop: 'invertFramePalette', column: 'Invert Frame Palette', type: ColumnType.BOOLEAN },
      // ToDo: "database relations"
      // =XLOOKUP(INDEX(A:A, ROW()), images_bin!$A:$A, images_bin!$B:$B)
      // =ADDRESS(MATCH(INDEX(A:A, ROW()),images_bin!$A:$A, 0), 2, 4, TRUE, "images_bin")
      // =MATCH(INDEX(A:A, ROW()), images_bin!$A:$A, 0)
    ],
    items: images.reduce(reduceImagesMonochrome, []),
    keyColumn: 'hash',
    sheetId,
    sheetName: 'images',
    // updateFn: itemsStore.getState().setImages,
    updateFn: console.log.bind(console),
  });
};

export const updateImagesRGBN = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  images: Image[],
  newLastUpdateValue: number,
) => {
  await updateItems<RGBNImage>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      ...imagesCommonProps,
      // From RGBN Image
      { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
      { prop: 'hashes', column: 'Hashes', type: ColumnType.JSON },
    ],
    items: images.reduce(reduceImagesRGBN, []),
    keyColumn: 'hash',
    sheetId,
    sheetName: 'rgbnImages',
    // updateFn: itemsStore.getState().setImages,
    updateFn: console.log.bind(console),
  });
};

export const updateImageGroups = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  imageGroups: SerializableImageGroup[],
  newLastUpdateValue: number,
) => {
  await updateItems<SerializableImageGroup>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      { prop: 'id', column: 'ID', type: ColumnType.STRING },
      { prop: 'title', column: 'Title', type: ColumnType.STRING },
      { prop: 'slug', column: 'Slug', type: ColumnType.STRING },
      { prop: 'created', column: 'Created', type: ColumnType.STRING },
      { prop: 'coverImage', column: 'Cover Image Hash', type: ColumnType.STRING },
      { prop: 'images', column: 'Images', type: ColumnType.JSON },
      { prop: 'groups', column: 'Sub-Groups', type: ColumnType.JSON },
    ],
    items: imageGroups,
    keyColumn: 'id',
    sheetId,
    sheetName: 'imageGroups',
    updateFn: console.log.bind(console),
  });
};

export const updatePalettes = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  palettes: Palette[],
  newLastUpdateValue: number,
) => {
  await updateItems<Palette>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      { prop: 'shortName', column: 'ShortName', type: ColumnType.STRING },
      { prop: 'name', column: 'Name', type: ColumnType.STRING },
      { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
      { prop: 'origin', column: 'Origin', type: ColumnType.STRING },
    ],
    items: palettes.filter(({ isPredefined }) => !isPredefined),
    keyColumn: 'shortName',
    sheetId,
    sheetName: 'palettes',
    // updateFn: itemsStore.getState().setPalettes,
    updateFn: console.log.bind(console),
  });
};


export const updateFrames = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  frames: Frame[],
  newLastUpdateValue: number,
) => {
  await updateItems<Frame>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      { prop: 'id', column: 'ID', type: ColumnType.STRING },
      { prop: 'hash', column: 'Hash', type: ColumnType.STRING },
      { prop: 'name', column: 'Name', type: ColumnType.STRING },
      { prop: 'lines', column: 'Lines', type: ColumnType.NUMBER },
    ],
    items: frames,
    keyColumn: 'id',
    sheetId,
    sheetName: 'frames',
    updateFn: console.log.bind(console),
  });
};


export const updateFrameGroups = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  frameGroups: FrameGroup[],
  newLastUpdateValue: number,
) => {
  await updateItems<FrameGroup>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      { prop: 'id', column: 'ID', type: ColumnType.STRING },
      { prop: 'name', column: 'Name', type: ColumnType.STRING },
    ],
    items: frameGroups,
    keyColumn: 'id',
    sheetId,
    sheetName: 'frameGroups',
    updateFn: console.log.bind(console),
  });
};


export const updatePlugins = async (
  sheetsClient: typeof gapi.client.sheets,
  sheetId: string,
  plugins: Plugin[],
  newLastUpdateValue: number,
) => {
  await updateItems<Plugin>({
    sheetsClient,
    newLastUpdateValue,
    columns: [
      { prop: 'url', column: 'URL', type: ColumnType.STRING },
      { prop: 'name', column: 'Name', type: ColumnType.STRING },
      { prop: 'description', column: 'Description', type: ColumnType.STRING },
      { prop: 'config', column: 'Config', type: ColumnType.JSON },
      { prop: 'configParams', column: 'Config Params', type: ColumnType.JSON },
    ],
    items: plugins,
    keyColumn: 'url',
    sheetId,
    sheetName: 'plugins',
    updateFn: console.log.bind(console),
  });
};
