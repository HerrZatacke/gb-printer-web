import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Dialog } from '../../../types/Dialog';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { Plugin } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import confirm from './reducers/confirmReducer';
import editImage from './reducers/editImageReducer';
import editImageGroup from './reducers/editImageGroupReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frames from './reducers/framesReducer';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  confirm: Reducer<Dialog[]>,
  editImage: Reducer<CurrentEditBatch | null>,
  editImageGroup: Reducer<EditGroupInfo | null>,
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frames: Reducer<Frame[]>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  confirm,
  editImage,
  editImageGroup,
  editFrame,
  editPalette,
  editRGBNImages,
  frameGroupNames,
  frames,
  images,
  imageGroups,
  palettes,
  pickColors,
  plugins,
};

export default combineReducers(reducers);
