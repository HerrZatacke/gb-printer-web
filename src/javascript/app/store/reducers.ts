import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Image } from '../../../types/Image';
import type { Plugin } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import plugins from './reducers/pluginsReducer';

export interface Reducers extends ReducersMapObject {
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  plugins: Reducer<Plugin[]>,
}

const reducers: ReducersMapObject = {
  images,
  imageGroups,
  plugins,
};

export default combineReducers(reducers);
