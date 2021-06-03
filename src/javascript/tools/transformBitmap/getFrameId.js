const getFrameId = ({ frameSetNew, frameSet, frameIndex = '' }) => {
  const id = `${frameSetNew || frameSet}${frameIndex.padStart(2, '0')}`;
  return id.match(/^[a-z]{2,}\d{2}$/g) ? id : '';
};

export default getFrameId;
