import {
  ADD_IMAGES, ANIMATE_IMAGES,
  CONFIRM_ANSWERED,
  CREATE_GIF_PROGRESS,
  EXECUTE_PLUGIN_PROGRESS,
  IMPORTQUEUE_CANCEL,
  PRINTER_PROGRESS,
} from '../actions';

const progressReducer = (progress = { gif: 0, printer: 0 }, action) => {
  switch (action.type) {
    case ANIMATE_IMAGES:
      return {
        ...progress,
        gif: 0.01,
      };
    case CREATE_GIF_PROGRESS:
      return {
        ...progress,
        gif: action.payload,
      };
    case EXECUTE_PLUGIN_PROGRESS:
      return {
        ...progress,
        plugin: action.payload,
      };
    case PRINTER_PROGRESS:
      return {
        ...progress,
        printer: action.payload,
      };
    case ADD_IMAGES:
    case IMPORTQUEUE_CANCEL:
    case CONFIRM_ANSWERED:
      return {
        ...progress,
        printer: 0,
      };
    default:
      return progress;
  }
};

export default progressReducer;
