import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Image } from '../../../types/Image';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';

export interface Reducers extends ReducersMapObject {
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
}

const reducers: ReducersMapObject = {
  images,
  imageGroups,
};

export default combineReducers(reducers);
