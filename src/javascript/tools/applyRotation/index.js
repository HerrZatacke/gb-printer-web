// noinspection JSSuspiciousNameCombination
/* eslint-disable no-param-reassign */
const applyRotation = (srcCanvas, targetCanvas, rotation) => {
  const context = targetCanvas.getContext('2d');
  context.resetTransform();

  if (rotation % 2) {
    targetCanvas.height = srcCanvas.width;
    targetCanvas.width = srcCanvas.height;
  } else {
    targetCanvas.width = srcCanvas.width;
    targetCanvas.height = srcCanvas.height;
  }

  switch (rotation) {
    case 1:
      context.translate(srcCanvas.height, 0);
      break;
    case 2:
      context.translate(srcCanvas.width, srcCanvas.height);
      break;
    case 3:
      context.translate(0, srcCanvas.width);
      break;
    default:
      break;
  }

  context.rotate(rotation * 90 * Math.PI / 180);
  context.drawImage(srcCanvas, 0, 0);
};

export default applyRotation;
