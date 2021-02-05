import palettes from 'gb-palettes';

const definitions = [
  { // Holds the websocket url of a local webpack instance
    key: 'socketUrl',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings'],
    value: 'localhost:3001',
  },
  { // Url of a printer emulator to talk to
    key: 'printerUrl',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings'],
    value: '',
  },
  {
    // currently selected palette (used for new imports)
    key: 'activePalette',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 'bw',
  },
  {
    // Metadata of all images
    key: 'images',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['images', 'remote'],
    value: [],
  },
  {
    // displaymode of gallery page (list, 1x, 2x...)
    key: 'galleryView',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: '1x',
  },
  {
    // used scalings when exporting/downloading
    key: 'exportScaleFactors',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: [4],
  },
  {
    // used filetypes when exporting/downloading
    key: 'exportFileTypes',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: ['png'],
  },
  {
    // iterator/global image counter
    key: 'globalIndex',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 1,
  },
  {
    // concurrently visible images in gallery
    key: 'pageSize',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 15,
  },
  {
    // current selection of images
    key: 'imageSelection',
    saveLocally: true,
    saveRemote: false,
    saveExport: [],
    value: [],
  },
  {
    // currently selected r,g,b,n images to create a combined image
    key: 'rgbnImages',
    saveLocally: true,
    saveRemote: false,
    saveExport: [],
    value: {},
  },
  {
    // the image being edited currently
    key: 'editImage',
    saveLocally: true,
    saveRemote: false,
    saveExport: [],
    value: {},
  },
  {
    // how to save videos (loop, crop, yoyo, palette)
    key: 'videoParams',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: {},
  },
  {
    // current filter for images
    key: 'filter',
    saveLocally: true,
    saveRemote: false,
    saveExport: [],
    value: {},
  },
  {
    // framegoup to be applied when importing .sav files
    key: 'savFrameTypes',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 'int',
  },
  {
    // sort criteria
    key: 'sortBy',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 'created_asc',
  },
  {
    // if frame will be cropped when exporting
    key: 'exportCropFrame',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: false,
  },
  {
    // visiblility of dates in gallery
    key: 'hideDates',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: false,
  },
  {
    // list of predefined palettes
    key: 'palettes',
    saveLocally: false, // do not save locally as they are a installed module
    saveRemote: false,
    saveExport: [],
    value: palettes,
  },
  {
    // user has seen the message about frames removal in version 1.7.0
    key: 'framesMessage',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
    value: 0,
  },
  {
    // set of usable frames
    key: 'frames',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['frames', 'remote'],
    value: [],
  },
  {
    // this key s being programatically removed even on a debug export due to possible stored tokens/passwords
    key: 'gitStorage',
    saveLocally: true,
    saveRemote: false,
    saveExport: [],
    value: {
      use: false,
      owner: '',
      repo: '',
      branch: '',
      token: '',
    },
  },
];

const defaults = {};
definitions.forEach(({ key, value }) => {
  defaults[key] = value;
});

export {
  defaults,
  definitions,
};
