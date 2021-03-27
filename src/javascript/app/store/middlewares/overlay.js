const overlay = (store) => {

  document.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape') || (ev.key === 'Esc')) {

      store.dispatch({
        type: 'CONFIRM_ANSWERED',
      });
    }
  });

  return (next) => (action) => {
    next(action);
  };
};

export default overlay;
