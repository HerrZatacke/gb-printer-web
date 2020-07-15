let support = null;

const supportsWebmWriter = () => {
  if (support !== null) {
    return support;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const imgData = canvas.toDataURL('image/webp');

  support = imgData.indexOf('data:image/webp;base64') === 0;
  return support;
};

export default supportsWebmWriter;
