let canShare: boolean | null = null;

const canShareReducer = (): boolean => {
  if (canShare === null) {
    try {
      canShare = window.navigator.canShare({
        files: [new File([new Blob(['t', 'e', 's', 't'])], 'test.txt', { type: 'text/plain', lastModified: Date.now() })],
      });
    } catch (error) {
      canShare = false;
    }
  }

  return canShare;
};

export default canShareReducer;
