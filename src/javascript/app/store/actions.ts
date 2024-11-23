export enum Actions {
  // Palettes
  PALETTE_DELETE = 'PALETTE_DELETE',
  PALETTE_UPDATE = 'PALETTE_UPDATE',
  PALETTE_EDIT = 'PALETTE_EDIT',
  PALETTE_CLONE = 'PALETTE_CLONE',

  // Frames
  ADD_FRAME = 'ADD_FRAME',
  DELETE_FRAME = 'DELETE_FRAME',
  UPDATE_FRAME = 'UPDATE_FRAME',

  // Generic config
  SET_ENABLE_IMAGE_GROUPS = 'SET_ENABLE_IMAGE_GROUPS',

  // Images
  ADD_IMAGES = 'ADD_IMAGES',
  DELETE_IMAGE = 'DELETE_IMAGE',
  DELETE_IMAGES = 'DELETE_IMAGES',
  UPDATE_IMAGES = 'UPDATE_IMAGES',
  UPDATE_IMAGES_BATCH_CHANGES = 'UPDATE_IMAGES_BATCH_CHANGES',
  IMAGE_FAVOURITE_TAG = 'IMAGE_FAVOURITE_TAG',
  REHASH_IMAGE = 'REHASH_IMAGE',

  // ImageGroups
  ADD_IMAGE_GROUP = 'ADD_IMAGE_GROUP',
  SET_IMAGE_GROUPS = 'SET_IMAGE_GROUPS',
  DELETE_IMAGE_GROUP = 'DELETE_IMAGE_GROUP',
  UPDATE_IMAGE_GROUP = 'UPDATE_IMAGE_GROUP',

  // Storage (Git + Dropbox)
  JSON_EXPORT = 'JSON_EXPORT',
  JSON_IMPORT = 'JSON_IMPORT',

  // Progress
  CREATE_GIF_PROGRESS = 'CREATE_GIF_PROGRESS',

  // Features
  BATCH_TASK = 'BATCH_TASK',
  START_CREATE_RGB_IMAGES = 'START_CREATE_RGB_IMAGES',
  SAVE_NEW_RGB_IMAGES = 'SAVE_NEW_RGB_IMAGES',
  CANCEL_CREATE_RGB_IMAGES = 'CANCEL_CREATE_RGB_IMAGES',

  // Generic action types
  GLOBAL_UPDATE = 'GLOBAL_UPDATE',
  TRY_RECOVER_IMAGE_DATA = 'TRY_RECOVER_IMAGE_DATA',
  ADD_TO_QUEUE = 'ADD_TO_QUEUE',

  // New import workflow
  IMPORTQUEUE_CANCEL = 'IMPORTQUEUE_CANCEL',
}
