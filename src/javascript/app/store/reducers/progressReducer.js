/* eslint-disable default-param-last */
import { Actions } from '../actions';

const progressReducer = (progress = { gif: 0, printer: 0 }, action) => {
  switch (action.type) {
    case Actions.ANIMATE_IMAGES:
      return {
        ...progress,
        gif: 0.01,
      };
    case Actions.CREATE_GIF_PROGRESS:
      return {
        ...progress,
        gif: action.payload,
      };
    case Actions.EXECUTE_PLUGIN_PROGRESS:
      return {
        ...progress,
        plugin: action.payload,
      };
    case Actions.PRINTER_PROGRESS:
      return {
        ...progress,
        printer: action.payload,
      };
    case Actions.ADD_IMAGES:
    case Actions.IMPORTQUEUE_CANCEL:
    case Actions.CONFIRM_ANSWERED:
      return {
        ...progress,
        printer: 0,
      };
    default:
      return progress;
  }
};

export default progressReducer;
