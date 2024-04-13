const isTouchDevice = (): boolean => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (error) {
    return false;
  }
};

export default isTouchDevice;
