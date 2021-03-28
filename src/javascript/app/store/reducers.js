import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import canShare from './reducers/canShareReducer';
import confirm from './reducers/confirmReducer';
import dragover from './reducers/dragoverReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editPalette from './reducers/editPaletteReducer';
import exportFileTypes from './reducers/exportFileTypesReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import filtersActiveTags from './reducers/filtersActiveTagsReducer';
import filtersVisible from './reducers/filtersVisibleReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import galleryView from './reducers/galleryViewReducer';
import gitStorage from './reducers/gitStorageReducer';
import handleExportFrame from './reducers/handleExportFrameReducer';
import hideDates from './reducers/hideDatesReducer';
import images from './reducers/imagesReducer';
import imageSelection from './reducers/imageSelectionReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lastSelectedImage from './reducers/lastSelectedImageReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import pageSize from './reducers/pageSizeReducer';
import palettes from './reducers/palettesReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import printerUrl from './reducers/printerUrlReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import recentImports from './reducers/recentImportsReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import savFrameTypes from './reducers/savFrameTypesReducer';
import sortBy from './reducers/sortByReducer';
import sortOptionsVisible from './reducers/sortOptionsVisibleReducer';
import syncBusy from './reducers/syncBusyReducer';
import syncSelect from './reducers/syncSelectReducer';
import videoParams from './reducers/videoParamsReducer';
import windowDimensions from './reducers/windowDimensionsReducer';

export default combineReducers({
  activePalette,
  canShare,
  confirm,
  dragover,
  dropboxStorage,
  editImage,
  editPalette,
  exportFileTypes,
  exportScaleFactors,
  filtersActiveTags,
  filtersVisible,
  frames,
  framesMessage,
  galleryView,
  gitStorage,
  handleExportFrame,
  hideDates,
  images,
  imageSelection,
  isFullscreen,
  lastSelectedImage,
  progressLog,
  lightboxImage,
  pageSize,
  palettes,
  printerBusy,
  printerData,
  printerFunctions,
  printerUrl,
  progress,
  recentImports,
  rgbnImages,
  savFrameTypes,
  sortBy,
  sortOptionsVisible,
  syncBusy,
  syncSelect,
  videoParams,
  windowDimensions,
});
