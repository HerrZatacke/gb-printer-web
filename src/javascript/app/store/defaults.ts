import { State } from './State';
import { ExportableState } from '../../tools/getGetSettings/types';
import { Actions } from './actions';

export enum ExportTypes {
  SETTINGS = 'settings',
  SELECTED_IMAGES = 'selected_images',
  IMAGES = 'images',
  REMOTE = 'remote',
  PALETTES = 'palettes',
  FRAMES = 'frames',
  FRAMEGROUP = 'framegroup',
  DEBUG = 'debug',
}

export interface ExportJSONAction {
  type: Actions.JSON_EXPORT,
  payload: ExportTypes,
}

export interface StorePropertyDefault {
  key: keyof State,
  saveLocally: boolean,
  saveExport: ExportTypes[],
  value: unknown,
}

export interface StorePropertyExportable extends Omit<StorePropertyDefault, 'key'> {
  key: keyof ExportableState,
}

const definitions: StorePropertyDefault[] = [
  { // Url of a printer emulator to talk to
    key: 'printerUrl',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: '',
  },
  { // Optional additional parameters for the printer remote page (passed as hash)
    key: 'printerParams',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: '',
  },
  {
    // currently selected palette (used for new imports)
    key: 'activePalette',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 'bw',
  },
  {
    // Metadata of all images
    key: 'images',
    saveLocally: true,
    saveExport: [ExportTypes.SELECTED_IMAGES, ExportTypes.IMAGES, ExportTypes.REMOTE],
    value: [],
  },
  {
    // displaymode of gallery page (list, 1x, 2x...)
    key: 'galleryView',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: '1x',
  },
  {
    // used scalings when exporting/downloading
    key: 'exportScaleFactors',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: [4],
  },
  {
    // used filetypes when exporting/downloading
    key: 'exportFileTypes',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: ['png'],
  },
  {
    // concurrently visible images in gallery
    key: 'pageSize',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: 30,
  },
  {
    // current selection of images
    key: 'imageSelection',
    saveLocally: true,
    saveExport: [ExportTypes.SELECTED_IMAGES],
    value: [],
  },
  {
    // currently selected r,g,b,n images to create a combined image
    key: 'rgbnImages',
    saveLocally: true,
    saveExport: [],
    value: {},
  },
  {
    // the image being edited currently
    key: 'editImage',
    saveLocally: true,
    saveExport: [],
    value: null,
  },
  {
    // how to save videos (loop, crop, yoyo, reverse, palette)
    key: 'videoParams',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: {},
  },
  {
    // current filter for images
    key: 'filtersActiveTags',
    saveLocally: true,
    saveExport: [],
    value: [],
  },
  {
    key: 'filtersVisible',
    saveLocally: true,
    saveExport: [],
    value: false,
  },
  {
    // framegoup to be applied when importing .sav files
    key: 'savFrameTypes',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 'int',
  },
  {
    // sort criteria
    key: 'sortBy',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 'created_asc',
  },
  {
    // how frame frame will be handled when exporting
    key: 'handleExportFrame',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 'keep',
  },
  {
    // if the "last seen" image from a .sav will be imported too
    key: 'importLastSeen',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: true,
  },
  {
    // if the "deleted" images from a .sav will be imported too
    key: 'importDeleted',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: true,
  },
  {
    // if images will get padded up to 144px on import
    key: 'importPad',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: false,
  },
  {
    // visiblility of dates in gallery
    key: 'hideDates',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: false,
  },
  {
    // general debug option
    key: 'enableDebug',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: false,
  },
  {
    // list of predefined palettes
    key: 'palettes',
    saveLocally: true,
    saveExport: [ExportTypes.PALETTES, ExportTypes.REMOTE],
    value: [],
  },
  {
    // list of plugins
    key: 'plugins',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: [],
  },
  {
    // user has seen the message about frames removal in version 1.7.0
    key: 'framesMessage',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 0,
  },
  {
    // set of usable frames
    key: 'frames',
    saveLocally: true,
    saveExport: [ExportTypes.FRAMES, ExportTypes.REMOTE, ExportTypes.FRAMEGROUP],
    value: [],
  },
  {
    // set of usable frames
    key: 'frameGroupNames',
    saveLocally: true,
    saveExport: [ExportTypes.FRAMES, ExportTypes.REMOTE, ExportTypes.FRAMEGROUP],
    value: [],
  },
  {
    key: 'recentImports',
    saveLocally: true,
    saveExport: [],
    value: [],
  },
  {
    // this key s being programatically removed even on a debug export due to possible stored tokens/passwords
    key: 'gitStorage',
    saveLocally: true,
    saveExport: [],
    value: {
      use: false,
      owner: '',
      repo: '',
      branch: '',
      token: '',
      throttle: '330',
    },
  },
  {
    // this key s being programatically removed even on a debug export due to possible stored tokens/passwords
    key: 'dropboxStorage',
    saveLocally: true,
    saveExport: [],
    value: {
      path: '',
    },
  },
  {
    key: 'useSerials',
    saveLocally: true,
    saveExport: [],
    value: false,
  },
  {
    key: 'syncLastUpdate',
    saveLocally: true,
    saveExport: [],
    value: {
      dropbox: 0,
      local: 0,
    },
  },
  {
    key: 'preferredLocale',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: navigator.language,
  },
  {
    key: 'bitmapQueue',
    saveLocally: false,
    saveExport: [],
    value: [],
  },
  {
    key: 'importQueue',
    saveLocally: false,
    saveExport: [],
    value: [],
  },
  {
    key: 'frameQueue',
    saveLocally: false,
    saveExport: [],
    value: [],
  },
  {
    key: 'trashCount',
    saveLocally: false,
    saveExport: [],
    value: { frames: 0, images: 0, show: false },
  },
  {
    key: 'forceMagicCheck',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS],
    value: true,
  },
];

const defaults: Partial<State> = {};
definitions.forEach(({ key, value }) => {
  Object.assign(defaults, { [key]: value });
});

export {
  defaults,
  definitions,
};
