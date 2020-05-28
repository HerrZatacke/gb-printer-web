import { applyMiddleware } from 'redux';
import batch from './middlewares/batch';
import confirmation from './middlewares/confirmation';
import deleteImage from './middlewares/deleteImage';
import fileDrop from './middlewares/fileDrop';
import hideLiveImage from './middlewares/hideLiveImage';
import lightbox from './middlewares/lightbox';
import plainText from './middlewares/plainText';
import saveEditImage from './middlewares/saveEditImage';
import saveLineBuffer from './middlewares/saveLineBuffer';
import saveRGBNImage from './middlewares/saveRGBNImage';
import serialportWebocket from './middlewares/serialportWebocket';
import startDownload from './middlewares/startDownload';
import triggerMock from './middlewares/triggerMock';

export default applyMiddleware(
  batch,
  confirmation,
  deleteImage,
  fileDrop,
  hideLiveImage,
  lightbox,
  plainText,
  saveEditImage,
  saveLineBuffer,
  saveRGBNImage,
  serialportWebocket,
  startDownload,
  triggerMock,
);
