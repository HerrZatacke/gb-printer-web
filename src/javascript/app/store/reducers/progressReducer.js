const progressReducer = (progress = { gif: 0 }, action) => {
  switch (action.type) {
    case 'CREATE_GIF_PROGRESS':
      return {
        ...progress,
        gif: action.payload,
      };
    default:
      return progress;
  }
};

export default progressReducer;
