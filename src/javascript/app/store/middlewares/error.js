const handleErrors = () => (next) => (action) => {

  if (action.type === 'ERROR') {
    // eslint-disable-next-line no-alert
    alert(action.payload);
  }

  next(action);
};

export default handleErrors;
