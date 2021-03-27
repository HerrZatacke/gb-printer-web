import getFrameId from './getFrameId';

const getQuestions = ({ frameGroups, fileName }) => ({
  frameSet = '',
  frameSetNew = '',
  frameIndex = '',
  frameName = '',
}) => {
  const frameId = getFrameId({ frameSet, frameSetNew, frameIndex });

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
      label: 'Add or replace at index',
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
  ];
};

export default getQuestions;
