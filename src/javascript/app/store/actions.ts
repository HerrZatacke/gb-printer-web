export enum Actions {
  // View
  SET_CURRENT_GALLERY_VIEW = 'SET_CURRENT_GALLERY_VIEW',
  SET_IS_FULLSCREEN = 'SET_IS_FULLSCREEN',

  // Lightbox
  SET_LIGHTBOX_IMAGE_INDEX = 'SET_LIGHTBOX_IMAGE_INDEX',
  LIGHTBOX_NEXT = 'LIGHTBOX_NEXT',
  LIGHTBOX_PREV = 'LIGHTBOX_PREV',
  LIGHTBOX_FULLSCREEN = 'LIGHTBOX_FULLSCREEN',
  SET_LIGHTBOX_IMAGE_HASH = 'SET_LIGHTBOX_IMAGE_HASH',

  // Palettes
  PALETTE_SET_ACTIVE = 'PALETTE_SET_ACTIVE',
  PALETTE_DELETE = 'PALETTE_DELETE',
  SET_EDIT_PALETTE = 'SET_EDIT_PALETTE',
  PALETTE_CANCEL_EDIT = 'PALETTE_CANCEL_EDIT',
  PALETTE_UPDATE = 'PALETTE_UPDATE',
  PALETTE_EDIT = 'PALETTE_EDIT',
  PALETTE_CLONE = 'PALETTE_CLONE',
  SET_PALETTE_SORT = 'SET_PALETTE_SORT',

  // Dialogs
  CONFIRM_ASK = 'CONFIRM_ASK',
  CONFIRM_ANSWERED = 'CONFIRM_ANSWERED',
  FRAMES_MESSAGE_SHOW = 'FRAMES_MESSAGE_SHOW',
  FRAMES_MESSAGE_HIDE = 'FRAMES_MESSAGE_HIDE',

  // Frames
  ADD_FRAME = 'ADD_FRAME',
  DELETE_FRAME = 'DELETE_FRAME',
  EDIT_FRAME = 'EDIT_FRAME',
  CANCEL_EDIT_FRAME = 'CANCEL_EDIT_FRAME',
  UPDATE_FRAME = 'UPDATE_FRAME',
  NAME_FRAMEGROUP = 'NAME_FRAMEGROUP',

  // Generic config
  SET_HANDLE_EXPORT_FRAME = 'SET_HANDLE_EXPORT_FRAME',
  SET_SAV_FRAME_TYPES = 'SET_SAV_FRAME_TYPES',
  UPDATE_EXPORT_FILE_TYPES = 'UPDATE_EXPORT_FILE_TYPES',
  UPDATE_EXPORT_SCALE_FACTORS = 'UPDATE_EXPORT_SCALE_FACTORS',
  SET_HIDE_DATES = 'SET_HIDE_DATES',
  SET_PREFERRED_LOCALE = 'SET_PREFERRED_LOCALE',
  SET_IMPORT_LAST_SEEN = 'SET_IMPORT_LAST_SEEN',
  SET_IMPORT_DELETED = 'SET_IMPORT_DELETED',
  SET_FORCE_MAGIC_CHECK = 'SET_FORCE_MAGIC_CHECK',
  SET_IMPORT_PAD = 'SET_IMPORT_PAD',
  SET_PAGESIZE = 'SET_PAGESIZE',
  SHOW_SERIALS = 'SHOW_SERIALS',
  USE_SERIALS = 'USE_SERIALS',
  SET_DEBUG = 'SET_DEBUG',

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

  // ImageGroups
  ADD_IMAGE_GROUP = 'ADD_IMAGE_GROUP',
  SET_IMAGE_GROUPS = 'SET_IMAGE_GROUPS',
  DELETE_IMAGE_GROUP = 'DELETE_IMAGE_GROUP',
  EDIT_IMAGE_GROUP = 'EDIT_IMAGE_GROUP',
  CANCEL_EDIT_IMAGE_GROUP = 'CANCEL_EDIT_IMAGE_GROUP',
  // UPDATE_IMAGE_GROUPS = 'UPDATE_IMAGE_GROUPS',

  // Drag Drop
  IMPORT_DRAGOVER_START = 'IMPORT_DRAGOVER_START',
  IMPORT_DRAGOVER_END = 'IMPORT_DRAGOVER_END',

  // Dropbox
  DROPBOX_LOGOUT = 'DROPBOX_LOGOUT',
  SET_DROPBOX_STORAGE = 'SET_DROPBOX_STORAGE',
  DROPBOX_LOG_ACTION = 'DROPBOX_LOG_ACTION',
  LAST_UPDATE_DROPBOX_REMOTE = 'LAST_UPDATE_DROPBOX_REMOTE',
  DROPBOX_SETTINGS_IMPORT = 'DROPBOX_SETTINGS_IMPORT',
  DROPBOX_START_AUTH = 'DROPBOX_START_AUTH',

  // Git
  SET_GIT_STORAGE = 'SET_GIT_STORAGE',
  GITSTORAGE_LOG_ACTION = 'GITSTORAGE_LOG_ACTION',
  GIT_SETTINGS_IMPORT = 'GIT_SETTINGS_IMPORT',

  // Storage (Git + Dropbox)
  STORAGE_SYNC_DONE = 'STORAGE_SYNC_DONE',
  STORAGE_DIFF_DONE = 'STORAGE_DIFF_DONE',
  STORAGE_SYNC_START = 'STORAGE_SYNC_START',
  STORAGE_SYNC_SELECT = 'STORAGE_SYNC_SELECT',
  STORAGE_SYNC_CANCEL = 'STORAGE_SYNC_CANCEL',
  JSON_EXPORT = 'JSON_EXPORT',
  JSON_IMPORT = 'JSON_IMPORT',

  // Tags / Filters
  SET_ACTIVE_TAGS = 'SET_ACTIVE_TAGS',
  SET_AVAILABLE_TAGS = 'SET_AVAILABLE_TAGS',
  SHOW_FILTERS = 'SHOW_FILTERS',
  HIDE_FILTERS = 'HIDE_FILTERS',

  // Selection
  IMAGE_SELECTION_REMOVE = 'IMAGE_SELECTION_REMOVE',
  IMAGE_SELECTION_ADD = 'IMAGE_SELECTION_ADD',
  IMAGE_SELECTION_SET = 'IMAGE_SELECTION_SET',
  IMAGE_SELECTION_SHIFTCLICK = 'IMAGE_SELECTION_SHIFTCLICK',

  // Sorting
  SET_SORT_BY = 'SET_SORT_BY',
  SHOW_SORT_OPTIONS = 'SHOW_SORT_OPTIONS',
  HIDE_SORT_OPTIONS = 'HIDE_SORT_OPTIONS',

  // Plugins
  PLUGIN_REMOVE = 'PLUGIN_REMOVE',
  PLUGIN_ADD = 'PLUGIN_ADD',
  PLUGIN_UPDATE_PROPERTIES = 'PLUGIN_UPDATE_PROPERTIES',
  PLUGIN_UPDATE_CONFIG = 'PLUGIN_UPDATE_CONFIG',
  PLUGIN_IMAGE = 'PLUGIN_IMAGE',
  PLUGIN_IMAGES = 'PLUGIN_IMAGES',

  // Progress
  EXECUTE_PLUGIN_PROGRESS = 'EXECUTE_PLUGIN_PROGRESS',
  PRINTER_PROGRESS = 'PRINTER_PROGRESS',
  CREATE_GIF_PROGRESS = 'CREATE_GIF_PROGRESS',
  LOG_CLEAR = 'LOG_CLEAR',

  // WiFi-Printer
  SET_PRINTER_PARAMS = 'SET_PRINTER_PARAMS',
  SET_PRINTER_URL = 'SET_PRINTER_URL',
  REMOTE_CALL_FUNCTION = 'REMOTE_CALL_FUNCTION',
  HEARTBEAT_TIMED_OUT = 'HEARTBEAT_TIMED_OUT',
  PRINTER_FUNCTIONS_RECEIVED = 'PRINTER_FUNCTIONS_RECEIVED',
  PRINTER_DATA_RECEIVED = 'PRINTER_DATA_RECEIVED',
  PRINTER_RESET = 'PRINTER_RESET',

  // Features
  ANIMATE_IMAGES = 'ANIMATE_IMAGES',
  UPDATE_RGBN_PART = 'UPDATE_RGBN_PART',
  SET_VIDEO_PARAMS = 'SET_VIDEO_PARAMS',
  CANCEL_ANIMATE_IMAGES = 'CANCEL_ANIMATE_IMAGES',
  SAVE_RGBN_IMAGE = 'SAVE_RGBN_IMAGE',
  SHARE_IMAGE = 'SHARE_IMAGE',
  START_DOWNLOAD = 'START_DOWNLOAD',
  DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION',
  BATCH_TASK = 'BATCH_TASK',
  START_CREATE_RGB_IMAGES = 'START_CREATE_RGB_IMAGES',
  SAVE_NEW_RGB_IMAGES = 'SAVE_NEW_RGB_IMAGES',
  CANCEL_CREATE_RGB_IMAGES = 'CANCEL_CREATE_RGB_IMAGES',

  // Generic action types
  GLOBAL_UPDATE = 'GLOBAL_UPDATE',
  WINDOW_DIMENSIONS = 'WINDOW_DIMENSIONS',
  ERROR = 'ERROR',
  DISMISS_ERROR = 'DISMISS_ERROR',
  TRY_RECOVER_IMAGE_DATA = 'TRY_RECOVER_IMAGE_DATA',
  IMPORT_FILES = 'IMPORT_FILES',
  ADD_TO_QUEUE = 'ADD_TO_QUEUE',

  // New import workflow
  BITMAPQUEUE_ADD = 'BITMAPQUEUE_ADD',
  BITMAPQUEUE_CANCEL = 'BITMAPQUEUE_CANCEL',
  IMPORTQUEUE_ADD = 'IMPORTQUEUE_ADD',
  IMPORTQUEUE_ADD_MULTI = 'IMPORTQUEUE_ADD_MULTI',
  IMPORTQUEUE_CANCEL = 'IMPORTQUEUE_CANCEL',
  IMPORTQUEUE_CANCEL_ONE = 'IMPORTQUEUE_CANCEL_ONE',
  FRAMEQUEUE_ADD = 'FRAMEQUEUE_ADD',
  FRAMEQUEUE_CANCEL_ONE = 'FRAMEQUEUE_CANCEL_ONE',

  // Trash
  SHOW_HIDE_TRASH = 'SHOW_HIDE_TRASH',
  SET_TRASH_COUNT_FRAMES = 'SET_TRASH_COUNT_FRAMES',
  SET_TRASH_COUNT_IMAGES = 'SET_TRASH_COUNT_IMAGES',
  UPDATE_TRASH_COUNT = 'UPDATE_TRASH_COUNT',
}
