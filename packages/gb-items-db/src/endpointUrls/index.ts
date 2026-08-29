export const EndpointUrls = {
  WS_INVALIDATIONS: '/invalidations',

  GET_HEALTH: '/health',
  GET_STATS: '/stats',
  GET_MAINTENANCE: '/maintenance',
  GET_USAGES: '/usages',

  POST_PLUGINS: '/plugins',
  POST_PLUGINS_BYURLS: '/plugins/byUrls',
  POST_PLUGINS_UPDATE: '/plugins/update',
  POST_PLUGINS_DELETE: '/plugins/delete',

  POST_PALETTES: '/palettes',
  POST_PALETTES_BYSHORTNAMES: '/palettes/byShortNames',
  POST_PALETTES_UPDATE: '/palettes/update',
  POST_PALETTES_DELETE: '/palettes/delete',

  POST_IMAGES: '/images',
  POST_IMAGES_TAGS: '/images/tags',
  POST_IMAGES_BYHASHES: '/images/byHashes',
  POST_IMAGES_BYANYHASHES: '/images/byAnyHashes',
  POST_IMAGES_HASHESBYGROUPID: '/images/hashesByGroupId',
  POST_IMAGES_GROUPITEMSBYGROUPID: '/images/groupItemsByGroupId',
  POST_IMAGES_UPDATE: '/images/update',
  POST_IMAGES_DELETE: '/images/delete',

  POST_IMAGEGROUPS_LIST: '/imageGroups/list',
  POST_IMAGEGROUPS_TREE: '/imageGroups/tree',
  POST_IMAGEGROUPS_UPDATE: '/imageGroups/update',
  POST_IMAGEGROUPS_DELETE: '/imageGroups/delete',

  POST_FRAMES: '/frames',
  POST_FRAMES_BYHASHES: '/frames/byHashes',
  POST_FRAMES_BYIDS: '/frames/byIds',
  POST_FRAMES_UPDATE: '/frames/update',
  POST_FRAMES_DELETE: '/frames/delete',

  POST_FRAMEGROUPS: '/frameGroups',
  POST_FRAMEGROUPS_UPDATE: '/frameGroups/update',
  POST_FRAMEGROUPS_DELETE: '/frameGroups/delete',

  POST_BINARYIMAGES_BYHASHES: '/binaryImages/byHashes',
  POST_BINARYIMAGES_HASHES: '/binaryImages/hashes',
  POST_BINARYIMAGES_UPDATE: '/binaryImages/update',
  POST_BINARYIMAGES_DELETE: '/binaryImages/delete',

  POST_BINARYFRAMES_BYHASHES: '/binaryFrames/byHashes',
  POST_BINARYFRAMES_HASHES: '/binaryFrames/hashes',
  POST_BINARYFRAMES_UPDATE: '/binaryFrames/update',
  POST_BINARYFRAMES_DELETE: '/binaryFrames/delete',
} as const;
export type EndpointUrls = (typeof EndpointUrls)[keyof typeof EndpointUrls];

