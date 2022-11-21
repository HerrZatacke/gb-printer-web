const checkPrinter = () => (
  fetch('/dumps/list')
    .then((res) => res.json())
    .then((data) => {
      // the ArduinoJSON library strangely sometimes did not include all items in the list, so this is a basic check.
      if (data.fs && (data.fs.dumpcount !== data.dumps.length)) {
        throw new Error('Inconststent image count received from printer.');
      }

      return {
        printerData: {
          ...data,
          dumps: [...data.dumps].sort(),
        },
      };
    })
);

export default checkPrinter;
