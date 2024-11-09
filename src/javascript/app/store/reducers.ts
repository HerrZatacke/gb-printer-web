import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { PickColors } from '../../../types/PickColors';
import type { Plugin } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import editImageGroup from './reducers/editImageGroupReducer';
import editImage from './reducers/editImageReducer';
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
  editImageGroup: Reducer<EditGroupInfo | null>,
  editImage: Reducer<CurrentEditBatch | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frames: Reducer<Frame[]>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  palettes: Reducer<Palette[]>,
  pickColors: Reducer<PickColors | null>
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  editImage,
  editImageGroup,
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
