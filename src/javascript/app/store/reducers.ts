import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '../../../types/Sync';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { ImportItem } from '../../../types/ImportItem';
import type { Palette } from '../../../types/Palette';
import type { Plugin } from '../../../types/Plugin';
import type { VideoParams } from '../../../types/VideoParams';
import type { QueueImage } from '../../../types/QueueImage';
import type { PrinterInfo } from '../../../types/Printer';
import type { PrinterFunction } from '../../consts/printerFunction';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import bitmapQueue from './reducers/bitmapQueueReducer';
import confirm from './reducers/confirmReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editImageGroup from './reducers/editImageGroupReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frameQueue from './reducers/frameQueueReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import gitStorage from './reducers/gitStorageReducer';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import importQueue from './reducers/importQueueReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import syncLastUpdate from './reducers/syncLastUpdateReducer';
import showSerials from './reducers/showSerialsReducer';
import videoParams from './reducers/videoParamsReducer';

export interface Reducers extends ReducersMapObject {
  bitmapQueue: Reducer<QueueImage[]>,
  confirm: Reducer<Dialog[]>,
  dropboxStorage: Reducer<DropBoxSettings>,
  editImage: Reducer<CurrentEditBatch | null>,
  editImageGroup: Reducer<EditGroupInfo | null>,
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frameQueue: Reducer<ImportItem[]>,
  frames: Reducer<Frame[]>,
  framesMessage: Reducer<number>,
  gitStorage: Reducer<GitStorageSettings>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  importQueue: Reducer<ImportItem[]>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
  printerBusy: Reducer<boolean>,
  printerData: Reducer<PrinterInfo>,
  printerFunctions: Reducer<PrinterFunction[]>,
  syncLastUpdate: Reducer<SyncLastUpdate>,
  showSerials: Reducer<boolean>,
  videoParams: Reducer<VideoParams>,
}

const reducers: ReducersMapObject = {
  bitmapQueue,
  confirm,
  dropboxStorage,
  editImage,
  editImageGroup,
  editFrame,
  editPalette,
  editRGBNImages,
  frameGroupNames,
  frameQueue,
  frames,
  framesMessage,
  gitStorage,
  images,
  imageGroups,
  importQueue,
  palettes,
  pickColors,
  plugins,
  printerBusy,
  printerData,
  printerFunctions,
  syncLastUpdate,
  showSerials,
  videoParams,
};

export default combineReducers(reducers);
