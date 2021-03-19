import checkPrinter from './checkPrinter';

const clearPrinter = () => (
  fetch('/dumps/clear')
    .then((res) => res.json())
    .then(({ deleted }) => {
      if (deleted !== undefined) {
        return checkPrinter();
      }

      throw new Error('error while deleting images');
    })
);

export default clearPrinter;
