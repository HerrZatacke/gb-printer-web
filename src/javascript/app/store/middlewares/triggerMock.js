const serialportWebocket = () => (next) => (action) => {

  if (action.type === 'START_MOCK') {
    fetch('/mock')
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }

  return next(action);
};

export default serialportWebocket;
