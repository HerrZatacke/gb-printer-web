const overlay = (store) => {

  document.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape') || (ev.key === 'Esc')) {
      const { confirm } = store.getState();

      store.dispatch({
        type: 'CONFIRM_ANSWERED',
        confirmId: confirm?.[0]?.id,
      });
    }
  });

  return (next) => (action) => {
    next(action);
  };
};

export default overlay;
