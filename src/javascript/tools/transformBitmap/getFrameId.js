const getFrameId = ({ frameSetNew, frameSet, frameIndex = '' }) => {
  const id = `${frameSetNew || frameSet}${frameIndex.padStart(2, '0')}`;
  return id.match(/^[a-z]+\d{2}$/g) ? id : '';
};

export default getFrameId;
