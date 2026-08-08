import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getQueryClient } from '@/contexts/QueryClient';
import { frameGroupsListQueryOptions } from '@/stores/items/queries/frameGroups';
import { framesByIdsQueryOptions } from '@/stores/items/queries/frames';

export interface EditFrameData {
  initialId: string;
  frameIndex: number;
  frameGroup: string;
  frameName: string;
}

interface ParsedFrameId {
  groupName: string;
  frameIndex: number;
}

interface EditFrameDataValidation {
  idValid: boolean;
  groupIdValid: boolean;
  frameIndexValid: boolean;
  groupExists: boolean;
  formValid: boolean;
}

export const parseFrameId = (frameId: string): ParsedFrameId => {
  const frameGroupIdRegex = /^(?<groupName>[a-z]+)(?<index>[0-9]+)/g;

  const match = frameGroupIdRegex.exec(frameId);
  return {
    groupName: match?.groups?.groupName || '',
    frameIndex: parseInt(match?.groups?.index || '0', 10),
  };
};

const isValidFrameId = (frameId: string): boolean => {
  const {
    groupName,
    frameIndex,
  } = parseFrameId(frameId);

  return groupName.length > 1 && frameIndex > 0;
};

export const frameIdFromGroupAndIndex = (frameGroup: string, frameIndex: number) => {
  return `${frameGroup}${frameIndex.toString(10).padStart(2, '0')}`;
};

interface EditFrameDataValidationOptions {
  initialId: string;
  frameGroup: string;
  frameIndex: number;
}

const frameIdExists = async (testId: string): Promise<boolean> => {
  if (!testId) {
    return false;
  }
  const queryClient = getQueryClient();
  const { items: [foundFrame] } = await queryClient.fetchQuery(framesByIdsQueryOptions([testId]));
  return Boolean(foundFrame);
};

const frameGroupExists = async (testId: string): Promise<boolean> => {
  if (!testId) {
    return false;
  }
  const queryClient = getQueryClient();
  const { items: frameGroups } = await queryClient.fetchQuery(frameGroupsListQueryOptions());
  return frameGroups.some(({ id }) => id === testId);
};

const validateFrameEditData = async ({
  initialId,
  frameGroup,
  frameIndex,
}: EditFrameDataValidationOptions): Promise<EditFrameDataValidation> => {
  const fullId = frameIdFromGroupAndIndex(frameGroup, frameIndex);

  const idIsSelf = fullId === initialId;
  const idValid = (idIsSelf || !(await frameIdExists(fullId))) && isValidFrameId(fullId);
  const groupIdValid = Boolean(frameGroup.match(/^[a-z]{2,}$/g));
  const frameIndexValid = frameIndex > 0;
  const formValid = idValid && groupIdValid && frameIndexValid;
  const groupExists = await frameGroupExists(frameGroup);

  return {
    formValid,
    frameIndexValid,
    groupExists,
    groupIdValid,
    idValid,
  };
};

interface UseEditFrameForm {
  frameIndex: number;
  setFrameIndex: (frameIndex: number) => void;
  frameGroup: string;
  setFrameGroup: (frameGroup: string) => void;
  frameName: string;
  setFrameName: (frameName: string) => void;
  fullId: string;

  validation: EditFrameDataValidation;
}

export const useEditFrameForm = (
  editFrameData: EditFrameData,
  onEditDataChange: Dispatch<SetStateAction<EditFrameData | null>>,
  onFormValidChange: Dispatch<SetStateAction<boolean>>,
): UseEditFrameForm => {
  const [initialId] = useState<string>(editFrameData.initialId);
  const [frameGroup, setFrameGroup] = useState<string>(editFrameData.frameGroup);
  const [frameIndex, setFrameIndex] = useState<number>(editFrameData.frameIndex);
  const [frameName, setFrameName] = useState<string>(editFrameData.frameName);

  const fullId = frameIdFromGroupAndIndex(frameGroup, frameIndex);

  const [validation, setValidation] = useState<EditFrameDataValidation>({ formValid: true, frameIndexValid: true, groupExists: true, groupIdValid: true, idValid: true });

  useEffect(() => {
    onEditDataChange({
      initialId,
      frameGroup,
      frameIndex,
      frameName,
    });
    validateFrameEditData({
      frameIndex,
      frameGroup,
      initialId,
    })
      .then((newValidation) => {
        setValidation(newValidation);
        onFormValidChange(newValidation.formValid);
      });
  }, [frameGroup, frameIndex, frameName, initialId, onEditDataChange, onFormValidChange]);

  return {

    frameIndex,
    setFrameIndex,
    frameGroup,
    setFrameGroup,
    frameName,
    setFrameName,
    fullId,

    validation,
  };
};
