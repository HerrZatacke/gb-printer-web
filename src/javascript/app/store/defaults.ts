import type { ExportableState, State } from './State';
import { ExportTypes } from '../../consts/exportTypes';

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
    // Groups/Folders
    key: 'imageGroups',
    saveLocally: true,
    saveExport: [ExportTypes.REMOTE],
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
    // current selection of images
    key: 'imageSelection',
    saveLocally: true,
    saveExport: [ExportTypes.SELECTED_IMAGES],
    value: [],
  },
  {
    // the image being edited currently
    key: 'editImage',
    saveLocally: true,
    saveExport: [],
    value: null,
  },
  {
    // the imagegroup being edited currently
    key: 'editImageGroup',
    saveLocally: true,
    saveExport: [],
    value: null,
  },
  {
    // hashes used in the RGBN creation dialog
    key: 'editRGBNImages',
    saveLocally: true,
    saveExport: [],
    value: [],
  },
  {
    key: 'errors',
    saveLocally: false,
    saveExport: [],
    value: [],
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
    // sort criteria
    key: 'sortBy',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: 'created_asc',
  },
  {
    // to enable imagegroup feature
    key: 'enableImageGroups',
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
    // list of predefined palettes
    key: 'pickColors',
    saveLocally: false,
    saveExport: [],
    value: null,
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
];

const defaults: Partial<State> = {};
definitions.forEach(({ key, value }) => {
  Object.assign(defaults, { [key]: value });
});

export {
  defaults,
  definitions,
};
