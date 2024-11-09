export enum Actions {
  // Palettes
  PALETTE_DELETE = 'PALETTE_DELETE',
  SET_EDIT_PALETTE = 'SET_EDIT_PALETTE',
  PALETTE_CANCEL_EDIT = 'PALETTE_CANCEL_EDIT',
  PALETTE_UPDATE = 'PALETTE_UPDATE',
  PALETTE_EDIT = 'PALETTE_EDIT',
  PALETTE_CLONE = 'PALETTE_CLONE',

  // Frames
  ADD_FRAME = 'ADD_FRAME',
  DELETE_FRAME = 'DELETE_FRAME',
  EDIT_FRAME = 'EDIT_FRAME',
  CANCEL_EDIT_FRAME = 'CANCEL_EDIT_FRAME',
  UPDATE_FRAME = 'UPDATE_FRAME',
  NAME_FRAMEGROUP = 'NAME_FRAMEGROUP',

  // Images
  ADD_IMAGES = 'ADD_IMAGES',
  DELETE_IMAGE = 'DELETE_IMAGE',
  DELETE_IMAGES = 'DELETE_IMAGES',
  EDIT_IMAGE_SELECTION = 'EDIT_IMAGE_SELECTION',
  CANCEL_EDIT_IMAGES = 'CANCEL_EDIT_IMAGES',
  UPDATE_IMAGES = 'UPDATE_IMAGES',
  UPDATE_IMAGES_BATCH_CHANGES = 'UPDATE_IMAGES_BATCH_CHANGES',
  IMAGE_FAVOURITE_TAG = 'IMAGE_FAVOURITE_TAG',
  REHASH_IMAGE = 'REHASH_IMAGE',
  SET_PICK_COLORS = 'SET_PICK_COLORS',
  CANCEL_PICK_COLORS = 'CANCEL_PICK_COLORS',

  // Storage (Git + Dropbox)
  JSON_EXPORT = 'JSON_EXPORT',
  JSON_IMPORT = 'JSON_IMPORT',

  // Plugins
  PLUGIN_REMOVE = 'PLUGIN_REMOVE',
  PLUGIN_ADD = 'PLUGIN_ADD',
  PLUGIN_UPDATE_PROPERTIES = 'PLUGIN_UPDATE_PROPERTIES',
  PLUGIN_UPDATE_CONFIG = 'PLUGIN_UPDATE_CONFIG',
  PLUGIN_IMAGE = 'PLUGIN_IMAGE',
  PLUGIN_IMAGES = 'PLUGIN_IMAGES',

  // Progress
  CREATE_GIF_PROGRESS = 'CREATE_GIF_PROGRESS',

  // WiFi-Printer
  REMOTE_CALL_FUNCTION = 'REMOTE_CALL_FUNCTION',

  // Features
  SHARE_IMAGE = 'SHARE_IMAGE',
  START_DOWNLOAD = 'START_DOWNLOAD',
  DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION',
  BATCH_TASK = 'BATCH_TASK',
  START_CREATE_RGB_IMAGES = 'START_CREATE_RGB_IMAGES',
  SAVE_NEW_RGB_IMAGES = 'SAVE_NEW_RGB_IMAGES',
  CANCEL_CREATE_RGB_IMAGES = 'CANCEL_CREATE_RGB_IMAGES',

  // Generic action types
  GLOBAL_UPDATE = 'GLOBAL_UPDATE',
  TRY_RECOVER_IMAGE_DATA = 'TRY_RECOVER_IMAGE_DATA',
  IMPORT_FILES = 'IMPORT_FILES',
  ADD_TO_QUEUE = 'ADD_TO_QUEUE',

  // New import workflow
  IMPORTQUEUE_CANCEL = 'IMPORTQUEUE_CANCEL',
}
