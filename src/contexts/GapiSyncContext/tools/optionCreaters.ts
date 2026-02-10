import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { type ColumnSpec, ColumnType, UpdaterOptions } from '@/tools/sheetConversion/types';
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

export const createOptionsImages = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<MonochromeImage> => ({
  sheetsClient,
  sheetId,
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
  keyColumn: 'hash',
  sheetName: SheetName.IMAGES,
});

export const createOptionsImagesRGBN = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<RGBNImage> => ({
  sheetsClient,
  sheetId,
  columns: [
    ...imagesCommonProps,
    // From RGBN Image
    { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
    { prop: 'hashes', column: 'Hashes', type: ColumnType.JSON },
  ],
  keyColumn: 'hash',
  sheetName: SheetName.RGBN_IMAGES,
});

export const createOptionsImageGroups = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<SerializableImageGroup> => ({
  sheetsClient,
  sheetId,
  columns: [
    { prop: 'id', column: 'ID', type: ColumnType.STRING },
    { prop: 'title', column: 'Title', type: ColumnType.STRING },
    { prop: 'slug', column: 'Slug', type: ColumnType.STRING },
    { prop: 'created', column: 'Created', type: ColumnType.STRING },
    { prop: 'coverImage', column: 'Cover Image Hash', type: ColumnType.STRING },
    { prop: 'images', column: 'Images', type: ColumnType.JSON },
    { prop: 'groups', column: 'Sub-Groups', type: ColumnType.JSON },
  ],
  keyColumn: 'id',
  sheetName: SheetName.IMAGE_GROUPS,
});

export const createOptionsPalettes = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<Palette> => ({
  sheetsClient,
  sheetId,
  columns: [
    { prop: 'shortName', column: 'ShortName', type: ColumnType.STRING },
    { prop: 'name', column: 'Name', type: ColumnType.STRING },
    { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
    { prop: 'origin', column: 'Origin', type: ColumnType.STRING },
  ],
  keyColumn: 'shortName',
  sheetName: SheetName.PALETTES,
});


export const createOptionsFrames = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<Frame> => ({
  sheetsClient,
  sheetId,
  columns: [
    { prop: 'id', column: 'ID', type: ColumnType.STRING },
    { prop: 'hash', column: 'Hash', type: ColumnType.STRING },
    { prop: 'name', column: 'Name', type: ColumnType.STRING },
    { prop: 'lines', column: 'Lines', type: ColumnType.NUMBER },
  ],
  keyColumn: 'id',
  sheetName: SheetName.FRAMES,
});


export const createOptionsFrameGroups = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<FrameGroup> => ({
  sheetsClient,
  sheetId,
  columns: [
    { prop: 'id', column: 'ID', type: ColumnType.STRING },
    { prop: 'name', column: 'Name', type: ColumnType.STRING },
  ],
  keyColumn: 'id',
  sheetName: SheetName.FRAME_GROUPS,
});


export const createOptionsPlugins = (sheetsClient: typeof gapi.client.sheets, sheetId: string): UpdaterOptions<Plugin> => ({
  sheetsClient,
  sheetId,
  columns: [
    { prop: 'url', column: 'URL', type: ColumnType.STRING },
    { prop: 'name', column: 'Name', type: ColumnType.STRING },
    { prop: 'description', column: 'Description', type: ColumnType.STRING },
    { prop: 'config', column: 'Config', type: ColumnType.JSON },
    { prop: 'configParams', column: 'Config Params', type: ColumnType.JSON },
  ],
  keyColumn: 'url',
  sheetName: SheetName.PLUGINS,
});
