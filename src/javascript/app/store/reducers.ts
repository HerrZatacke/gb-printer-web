import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { Plugin } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import editImageGroup from './reducers/editImageGroupReducer';
import editImage from './reducers/editImageReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frames from './reducers/framesReducer';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import palettes from './reducers/palettesReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  editImageGroup: Reducer<EditGroupInfo | null>,
  editImage: Reducer<CurrentEditBatch | null>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frames: Reducer<Frame[]>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  editImage,
  editImageGroup,
  frameGroupNames,
  frames,
  images,
  imageGroups,
  palettes,
  plugins,
};

export default combineReducers(reducers);
