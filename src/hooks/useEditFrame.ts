import { useState } from 'react';
import { useStores } from '@/hooks/useStores';
import useEditStore from '@/stores/editStore';
import useItemsStore from '@/stores/itemsStore';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import getFrameGroups from '../tools/getFrameGroups';

interface UseEditFrame {
  groups: FrameGroup[],
  updateId: string,
  fullId: string,
  frameIndex: number,
  frameGroup: string,
  frameName: string,
  idValid: boolean,
  formValid: boolean,
  groupIdValid: boolean,
  frameIndexValid: boolean,
  setFrameIndex: (frameIndex: number) => void,
  setFrameGroup: (frameGroup: string) => void,
  setFrameName: (frameName: string) => void,
  cancelEdit: () => void,
  saveFrame: () => void,
}

const useEditFrame = (frame?: Frame): UseEditFrame => {
  const updateId = frame?.id || '';
  const { cancelEditFrame } = useEditStore();
  const { frames } = useItemsStore();
  const { frameGroups, addFrames } = useItemsStore();
  const { updateLastSyncLocalNow } = useStores();

  const groups = getFrameGroups(frames, frameGroups);
  const frameGroupIdRegex = /^(?<groupName>[a-z]+)(?<id>[0-9]+)/g;

  const match = frameGroupIdRegex.exec(updateId);
  const groupName = match?.groups?.groupName || '';
  const id = match?.groups?.id || '0';

  const [frameGroup, setFrameGroup] = useState<string>(groupName);
  const [frameIndex, setFrameIndex] = useState<number>(parseInt(id, 10));
  const [frameName, setFrameName] = useState<string>(frame?.name || '');
  const fullId = `${frameGroup}${frameIndex.toString(10).padStart(2, '0')}`;

  const idIsSelf = fullId === updateId;
  const idValid = idIsSelf || !(frames.find((findFrame) => (fullId === findFrame.id)));

  const groupIdValid = Boolean(frameGroup.match(/^[a-z]{2,}$/g));

  const frameIndexValid = frameIndex > 0;

  const formValid = (
    idValid &&
    groupIdValid &&
    frameIndexValid
  );

  const saveFrame = () => {
    cancelEditFrame();
    updateLastSyncLocalNow();
    addFrames([{
      hash: frame?.hash || '',
      id: fullId,
      name: frameName,
      lines: frame?.lines || 0,
    }]);
  };

  return {
    groups,
    updateId,
    fullId,
    frameIndex,
    frameGroup,
    frameName,
    idValid,
    formValid,
    groupIdValid,
    frameIndexValid,
    setFrameIndex,
    setFrameGroup,
    setFrameName,
    saveFrame,
    cancelEdit: cancelEditFrame,
  };
};

export default useEditFrame;
