const supports: Record<string, boolean> = {};

const supportsFileType = (fileType: string) => {
  if (supports[fileType] !== undefined) {
    return supports[fileType];
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  const imgData = canvas.toDataURL(`image/${fileType}`);

  supports[fileType] = imgData.indexOf(`data:image/${fileType};base64`) === 0;
  return supports[fileType];
};

const supportedCanvasImageFormats = () => (
  ['jpeg', 'jpg', 'png', 'webp', 'bmp', 'gif'].filter((fileType) => supportsFileType(fileType))
);

export default supportedCanvasImageFormats;
