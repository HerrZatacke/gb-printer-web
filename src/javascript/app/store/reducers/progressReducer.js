const progressReducer = (progress = { gif: 0, printer: 0 }, action) => {
  switch (action.type) {
    case 'ANIMATE_IMAGES':
      return {
        ...progress,
        gif: 0.01,
      };
    case 'CREATE_GIF_PROGRESS':
      return {
        ...progress,
        gif: action.payload,
      };
    case 'PRINTER_PROGRESS':
      return {
        ...progress,
        printer: action.payload,
      };
    case 'ADD_IMAGES':
      return {
        ...progress,
        printer: 0,
      };
    default:
      return progress;
  }
};

export default progressReducer;
