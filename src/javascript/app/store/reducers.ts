import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Image } from '../../../types/Image';
import images from './reducers/imagesReducer';

export interface Reducers extends ReducersMapObject {
  images: Reducer<Image[]>,
}

const reducers: ReducersMapObject = {
  images,
};

export default combineReducers(reducers);
