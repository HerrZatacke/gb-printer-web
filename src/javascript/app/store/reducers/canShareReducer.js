let canShare = null;

const canShareReducer = () => {
  if (canShare === null) {
    try {
      canShare = window.navigator.canShare({
        files: [new File([new Blob([...'test'])], 'test.txt', { type: 'text/plain', lastModified: new Date() })],
      });
    } catch (error) {
      canShare = false;
    }
  }

  return canShare;
};

export default canShareReducer;
