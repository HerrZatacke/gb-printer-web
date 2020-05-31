const validateCurrentPageIndex = (store) => (next) => (action) => {

  next(action);

  const state = store.getState();
  const totalPages = state.pageSize ? Math.ceil(state.images.length / state.pageSize) : 1;
  const currentPage = state.currentPage;

  if (currentPage === 0) {
    return;
  }

  if (totalPages <= currentPage) {
    store.dispatch({
      type: 'SET_CURRENTPAGE',
      payload: Math.max(0, totalPages - 1),
    });
  }

};

export default validateCurrentPageIndex;
