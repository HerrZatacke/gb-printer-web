import { Frame } from 'gb-printer-schemas';
import { Dispatch, SetStateAction, useState } from 'react';
import { EditFrameData, frameIdFromGroupAndIndex, parseFrameId } from '@/hooks/useEditFrameForm';
import { useFrames } from '@/hooks/useFrames';
import { useStores } from '@/hooks/useStores';
import { useEditStore } from '@/stores/stores';

interface UseEditFrame {
  editFrameData: EditFrameData | null;
  setHash: Dispatch<SetStateAction<string>>;
  onEditDataChange: Dispatch<SetStateAction<EditFrameData | null>>;
  onFormValidChange: Dispatch<SetStateAction<boolean>>;
  formValid: boolean;
  cancelEdit: () => void;
  saveFrame: () => Promise<void>;
}

const frameToEditFrameData = (frame: Frame): EditFrameData => {
  const { frameIndex, groupName } = parseFrameId(frame.id);
  return {
    initialId: frame.id,
    frameIndex,
    frameGroup: groupName,
    frameName: frame.name,
  };
};

const useEditFrame = (frame: Frame | null): UseEditFrame => {
  const { updateFrames } = useFrames({});
  const { cancelEditFrame } = useEditStore();
  const { updateLastSyncLocalNow } = useStores();
  const [hash, setHash] = useState<string>(frame?.hash || '');
  const [formValid, setFormValid] = useState<boolean>(true);
  const [editFrameData, setEditFrameData] = useState<EditFrameData | null>(null);
  const [prevFrame, setPrevFrame] = useState<Frame | null>(null);

  if (frame !== prevFrame) {
    setPrevFrame(frame);
    setHash(frame?.hash || '');
    setEditFrameData(frame ? frameToEditFrameData(frame) : null);
  }

  const saveFrame = async (): Promise<void> => {
    if (!editFrameData || !frame) {
      return;
    }

    await updateFrames([{
      hash: hash,
      id: frameIdFromGroupAndIndex(editFrameData.frameGroup, editFrameData.frameIndex),
      name: editFrameData.frameName,
      lines: frame.lines,
    }]);
    cancelEditFrame();
    updateLastSyncLocalNow();
  };

  return {
    editFrameData,
    setHash,
    onEditDataChange: setEditFrameData,
    onFormValidChange: setFormValid,
    formValid,
    cancelEdit: cancelEditFrame,
    saveFrame,
  };
};

export default useEditFrame;
