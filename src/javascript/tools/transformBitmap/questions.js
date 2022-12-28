import getFrameId from './getFrameId';
import isGoodScaleFactor from '../isGoodScaleFactor';

const getQuestions = ({ frameIds, frameGroups, fileName, scaleFactor = 1 }) => ({
  frameSet = '',
  frameSetNew = '',
  frameIndex = '',
  frameName = '',
}) => {
  const frameId = getFrameId({ frameSet, frameSetNew, frameIndex });
  const replaceFrame = frameIds.includes(frameId);

  const frameSetNewFormatOk = (
    frameSetNew.length !== 1 &&
    frameSetNew === frameSetNew.toLocaleLowerCase()
  );

  const notComplete = !(
    (frameId && frameName) ||
    (!frameId && !frameName)
  ) || !frameSetNewFormatOk;

  return [
    isGoodScaleFactor(scaleFactor) ? null : {
      label: `The scale factor of your image is ${scaleFactor.toPrecision(3)}. To get a clean result without artifacts, use images with factors being powers of two. (1, 2, 4, 8 ...)`,
      key: 'badScaleFactor',
      type: 'info',
      themes: ['warning'],
    },
    frameSetNewFormatOk ? null : {
      label: 'The ID of a frameset may only contain lowercase letters and must have at least a length of 2',
      key: 'badNewFrameSet',
      type: 'info',
      themes: ['error'],
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
        'Frame index (must be > 0)',
      key: 'frameIndex',
      type: 'number',
      min: 1,
      max: 99,
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
      themes: frameId && frameName ? ['info'] : ['warning'],
    },
    {
      type: 'confirmForm',
      notComplete,
    },
  ].filter(Boolean);
};

export default getQuestions;
