import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Dialog } from '../../../types/Dialog';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { PickColors } from '../../../types/PickColors';
import type { Plugin } from '../../../types/Plugin';
import confirm from './reducers/confirmReducer';
import editFrame from './reducers/editFrameReducer';
import editImage from './reducers/editImageReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frames from './reducers/framesReducer';
import images from './reducers/imagesReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  confirm: Reducer<Dialog[]>,
  editFrame: Reducer<string | null>,
  editImage: Reducer<CurrentEditBatch | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frames: Reducer<Frame[]>,
  images: Reducer<Image[]>,
  palettes: Reducer<Palette[]>,
  pickColors: Reducer<PickColors | null>
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  confirm,
  editFrame,
  editImage,
  editPalette,
  editRGBNImages,
  frameGroupNames,
  frames,
  images,
  palettes,
  pickColors,
  plugins,
};

export default combineReducers(reducers);
