import getFrameId from './getFrameId';

const getQuestions = ({ frameIds, frameGroups, fileName }) => ({
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

  return [
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
        `Frame #${frameIndex} will be replaced` :
        `Frame will be added at #${frameIndex}`,
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
  ];
};

export default getQuestions;
