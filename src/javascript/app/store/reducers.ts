import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Image } from '../../../types/Image';
import type { Plugin } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  frameGroupNames: Reducer<FrameGroup[]>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  frameGroupNames,
  images,
  imageGroups,
  plugins,
};

export default combineReducers(reducers);
