import { type Frame, type FrameGroup } from 'gb-printer-schemas';
import { useState, useEffect } from 'react';
import { type ExportTypes } from '@/consts/exportTypes';
import { useActivePalette } from '@/hooks/useActivePalette';
import { useFrameGroups } from '@/hooks/useFrameGroups';
import { useFrames } from '@/hooks/useFrames';
import { useStores } from '@/hooks/useStores';
import { useSettingsStore } from '@/stores/stores';
import { getFramesForGroup } from '@/tools/getFramesForGroup';
import { useImportExportSettings } from './useImportExportSettings';

const getValidFrameGroupId = (groups: FrameGroup[], byId: string): string => {
  const group = groups.find(({ id }) => id === byId);
  if (!group) {
    return groups[0]?.id || '';
  }

  return group.id;
};

interface UseFramesPage {
  selectedFrameGroup: string;
  groupFrames: Frame[];
  setSelectedFrameGroup: (id: string) => void;
  frameGroups: FrameGroup[];
  exportJson: (what: ExportTypes) => void;
  palette: string[];
  activeFrameGroupName: string;
  setActiveFrameGroupName: (name: string) => void;
  saveActiveFrameGroupName: () => void;
  activeFrameGroup: FrameGroup;
  enableDebug: boolean;
}

export const useFramesPage = (): UseFramesPage => {
  const { enableDebug, savFrameTypes } = useSettingsStore();
  const { frames } = useFrames({ list: true });
  const { frameGroups, updateFrameGroups } = useFrameGroups();
  const { updateLastSyncLocalNow } = useStores();
  const { downloadSettings } = useImportExportSettings();
  const palette = useActivePalette();

  const [groupFrames, setGroupFrames] = useState<Frame[]>([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(getValidFrameGroupId(frameGroups, savFrameTypes));

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (selectedFrameGroup) {
        setGroupFrames(getFramesForGroup(frames, selectedFrameGroup));
      } else {
        setGroupFrames([]);
      }
    }, 1);

    return () => window.clearTimeout(handle);
  }, [frames, selectedFrameGroup]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (selectedFrameGroup === '') {
        const possibleFrameGroup = getValidFrameGroupId(frameGroups, savFrameTypes);
        if (possibleFrameGroup !== '') {
          setSelectedFrameGroup(possibleFrameGroup);
        }
      }
    }, 1);

    return () => window.clearTimeout(handle);
  }, [frameGroups, frames, savFrameTypes, selectedFrameGroup]);

  const activeFrameGroup = frameGroups.find(({ id }) => id === selectedFrameGroup) || frameGroups[0];

  const [activeFrameGroupName, setActiveFrameGroupName] = useState<string>(activeFrameGroup?.name || '');
  const [prevActiveFrameGroupId, setPrevActiveFrameGroupId] = useState<string | undefined>(activeFrameGroup?.id);

  if (activeFrameGroup?.id !== prevActiveFrameGroupId) {
    setPrevActiveFrameGroupId(activeFrameGroup?.id);
    setActiveFrameGroupName(activeFrameGroup?.name || '');
  }

  const saveActiveFrameGroupName = () => {
    updateFrameGroups([{
      ...activeFrameGroup,
      name: activeFrameGroupName,
    }]);
    updateLastSyncLocalNow();
  };

  const exportJson = (what: ExportTypes) => downloadSettings(what, selectedFrameGroup);

  return {
    selectedFrameGroup,
    groupFrames,
    setSelectedFrameGroup,
    frameGroups,
    exportJson,
    palette: palette?.palette,
    activeFrameGroupName,
    setActiveFrameGroupName,
    saveActiveFrameGroupName,
    activeFrameGroup,
    enableDebug,
  };
};
