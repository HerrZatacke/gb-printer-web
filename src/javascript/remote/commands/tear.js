import checkPrinter from './checkPrinter';

const clearPrinter = () => (
  fetch('/reset')
    .then((res) => res.json())
    .then(({ result }) => {
      if (result === 'ok') {
        return checkPrinter();
      }

      throw new Error('error while deleting images');
    })
);

export default clearPrinter;
