const definitions = [
  { // Holds the websocket url of a local webpack instance
    key: 'socketUrl',
    saveLocally: true,
    saveExport: ['settings'],
    value: 'localhost:3001',
  },
  { // Url of a printer emulator to talk to
    key: 'printerUrl',
    saveLocally: true,
    saveExport: ['settings'],
    value: '',
  },
  {
    // currently selected palette (used for new imports)
    key: 'activePalette',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 'bw',
  },
  {
    // Metadata of all images
    key: 'images',
    saveLocally: true,
    saveExport: ['selected_images', 'images', 'remote'],
    value: [],
  },
  {
    // displaymode of gallery page (list, 1x, 2x...)
    key: 'galleryView',
    saveLocally: true,
    saveExport: ['settings'],
    value: '1x',
  },
  {
    // used scalings when exporting/downloading
    key: 'exportScaleFactors',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: [4],
  },
  {
    // used filetypes when exporting/downloading
    key: 'exportFileTypes',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: ['png'],
  },
  {
    // concurrently visible images in gallery
    key: 'pageSize',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 15,
  },
  {
    // current selection of images
    key: 'imageSelection',
    saveLocally: true,
    saveExport: ['selected_images'],
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
    // how to save videos (loop, crop, yoyo, palette)
    key: 'videoParams',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: {},
  },
  {
    // current filter for images
    key: 'filter',
    saveLocally: true,
    saveExport: [],
    value: {},
  },
  {
    // framegoup to be applied when importing .sav files
    key: 'savFrameTypes',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 'int',
  },
  {
    // sort criteria
    key: 'sortBy',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 'created_asc',
  },
  {
    // if frame will be cropped when exporting
    key: 'exportCropFrame',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: false,
  },
  {
    // visiblility of dates in gallery
    key: 'hideDates',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: false,
  },
  {
    // list of predefined palettes
    key: 'palettes',
    saveLocally: true,
    saveExport: ['palettes', 'remote'],
    value: [],
  },
  {
    // user has seen the message about frames removal in version 1.7.0
    key: 'framesMessage',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 0,
  },
  {
    // set of usable frames
    key: 'frames',
    saveLocally: true,
    saveExport: ['frames', 'remote'],
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
    value: {},
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
