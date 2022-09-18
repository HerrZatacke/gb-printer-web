import getFrameId from './getFrameId';

// noinspection JSBitwiseOperatorUsage
const isPowerOfTwo = (v) => (
  // eslint-disable-next-line no-bitwise
  v && !(v & (v - 1))
);

const getQuestions = ({ frameIds, frameGroups, fileName, scaleFactor = 1 }) => ({
  frameSet = '',
  frameSetNew = '',
  frameIndex = '',
  frameName = '',
}) => {
  const frameId = getFrameId({ frameSet, frameSetNew, frameIndex });
  const replaceFrame = frameIds.includes(frameId);

  const notComplete = !(
    (frameId && frameName) ||
    (!frameId && !frameName)
  );

  const isGoodScaleFactor = (
    isPowerOfTwo(scaleFactor) &&
    Math.floor(scaleFactor) === scaleFactor
  );

  return [
    isGoodScaleFactor ? null : {
      label: `The scale factor of your image is ${scaleFactor.toPrecision(3)}. To get a clean result without artifacts, use images with factors being powers of two. (1, 2, 4, 8 ...)`,
      key: 'badScaleFactor',
      type: 'info',
      themes: ['warning'],
    },
    {
      label: 'Add as frame to existing frameset',
      key: 'frameSet',
      type: 'select',
      options: frameGroups,
      disabled: !!frameSetNew,
    },
    {
      label: 'Create new frameset with ID (min. 2 chars)',
      key: 'frameSetNew',
      type: 'text',
      disabled: !!frameSet,
    },
    {
      label: replaceFrame ?
        `Frame index - frame ${frameId} will be replaced` :
        'Frame index',
      key: 'frameIndex',
      type: 'number',
      disabled: !(frameSet || frameSetNew.length > 1),
    },
    {
      label: 'Name of frame',
      key: 'frameName',
      type: 'text',
      disabled: !(frameSet || frameSetNew.length > 1),
    },
    {
      label: frameId && frameName ?
        `"${fileName}" will be imported as frame "${frameId}" - "${frameName}"` :
        `"${fileName}" will be imported as an image`,
      key: 'info',
      type: 'info',
    },
    {
      type: 'confirmForm',
      notComplete,
    },
  ].filter(Boolean);
};

export default getQuestions;
