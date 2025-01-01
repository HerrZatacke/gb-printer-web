let canShareValue: boolean | null = null;

export const canShare = (): boolean => {
  if (canShareValue === null) {
    try {
      canShareValue = window.navigator.canShare({
        files: [new File([new Blob(['t', 'e', 's', 't'])], 'test.txt', { type: 'text/plain', lastModified: Date.now() })],
      });
    } catch (error) {
      canShareValue = false;
    }
  }

  return canShareValue || false;
};
