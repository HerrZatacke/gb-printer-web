const definitions = [
  { // Url of a printer emulator to talk to
    key: 'printerUrl',
    saveLocally: true,
    saveExport: ['settings'],
    value: '',
  },
  { // Optional additional parameters for the printer remote page (passed as hash)
    key: 'printerParams',
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
    saveExport: ['settings'],
    value: 30,
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
    // how to save videos (loop, crop, yoyo, reverse, palette)
    key: 'videoParams',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
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
    // how frame frame will be handled when exporting
    key: 'handleExportFrame',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: 'keep',
  },
  {
    // if the "last seen" image from a .sav will be imported too
    key: 'importLastSeen',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: true,
  },
  {
    // if the "deleted" images from a .sav will be imported too
    key: 'importDeleted',
    saveLocally: true,
    saveExport: ['settings', 'remote'],
    value: true,
  },
  {
    // if images will get padded up to 144px on import
    key: 'importPad',
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
    // general debug option
    key: 'enableDebug',
    saveLocally: true,
    saveExport: ['settings'],
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
    // list of plugins
    key: 'plugins',
    saveLocally: true,
    saveRemote: false,
    saveExport: ['settings', 'remote'],
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
    saveExport: ['frames', 'remote', 'framegroup'],
    value: [],
  },
  {
    // set of usable frames
    key: 'frameGroupNames',
    saveLocally: true,
    saveExport: ['frames', 'remote', 'framegroup'],
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
    saveExport: ['settings'],
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
    saveExport: ['settings'],
    value: true,
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
