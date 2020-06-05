let canShare = null;

const canShareReducer = () => {
  if (canShare === null) {
    canShare = !!window.navigator.canShare && !!window.navigatior.canShare({
      files: [new File([new Blob([...'test'])], 'test.txt', { type: 'text/plain', lastModified: new Date() })],
    });
  }

  return canShare;
};

export default canShareReducer;
