const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (error) {
    return false;
  }
};

export default isTouchDevice;
