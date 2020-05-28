const batch = (store) => (next) => (action) => {

  if (action.type === 'BATCH_TASK') {
    const state = store.getState();
    console.log(state);
  }

  next(action);
};

export default batch;
