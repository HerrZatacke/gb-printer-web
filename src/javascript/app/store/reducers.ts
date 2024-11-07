import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings } from '../../../types/Sync';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { Plugin } from '../../../types/Plugin';
import confirm from './reducers/confirmReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frames from './reducers/framesReducer';
import gitStorage from './reducers/gitStorageReducer';
import images from './reducers/imagesReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  confirm: Reducer<Dialog[]>,
  dropboxStorage: Reducer<DropBoxSettings>,
  editImage: Reducer<CurrentEditBatch | null>,
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frames: Reducer<Frame[]>,
  gitStorage: Reducer<GitStorageSettings>,
  images: Reducer<Image[]>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  confirm,
  dropboxStorage,
  editImage,
  editFrame,
  editPalette,
  editRGBNImages,
  frameGroupNames,
  frames,
  gitStorage,
  images,
  palettes,
  pickColors,
  plugins,
};

export default combineReducers(reducers);
