import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFrameGroups from '../../../tools/getFrameGroups';
import { Actions } from '../../store/actions';
import type { FrameGroup } from '../../../../types/FrameGroup';
import type { FrameGroupNamesAction } from '../../../../types/actions/FrameActions';
import type { State } from '../../store/State';
import type { Frame } from '../../../../types/Frame';
import type { ExportJSONAction } from '../../../../types/actions/StorageActions';
import type { ExportTypes } from '../../../consts/exportTypes';

const getValidFrameGroupId = (groups: FrameGroup[], byId: string): string => {
  const group = groups.find(({ id }) => id === byId);
  if (!group) {
    return groups[0]?.id || '';
  }

  return group.id;
};

interface UseFrames {
  selectedFrameGroup: string,
  groupFrames: Frame[],
  setSelectedFrameGroup: (id: string) => void,
  frameGroups: FrameGroup[],
  exportJson: (what: ExportTypes) => void,
  palette: string[],
  setActiveFrameGroupName: (name: string) => void,
  activeFrameGroup: FrameGroup,
}

const useFrames = (): UseFrames => {
  const dispatch = useDispatch();

  const { savFrameTypes, frames, frameGroupNames, palette } = useSelector((state: State) => ({
    savFrameTypes: state.savFrameTypes,
    frames: state.frames,
    frameGroupNames: state.frameGroupNames,
    palette: state.palettes.find(({ shortName }) => shortName === state.activePalette) || state.palettes[0],
  }));

  const frameGroups = getFrameGroups(frames, frameGroupNames);
  const [groupFrames, setGroupFrames] = useState<Frame[]>([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(getValidFrameGroupId(frameGroups, savFrameTypes));

  useEffect(() => {
    if (selectedFrameGroup) {
      setGroupFrames(frames.reduce((acc: Frame[], frame: Frame): Frame[] => {
        const frameGroupIdRegex = /^(?<group>[a-z]+)(?<id>[0-9]+)/g;
        const group = frameGroupIdRegex.exec(frame.id)?.groups?.group;
        return (selectedFrameGroup === group) ? [...acc, frame] : acc;
      }, []));
    } else {
      setGroupFrames([]);
    }
  }, [frames, selectedFrameGroup]);

  const activeFrameGroup = frameGroups.find(({ id }) => (id === selectedFrameGroup)) || frameGroups[0];

  const setActiveFrameGroupName = (name: string) => {
    dispatch<FrameGroupNamesAction>({
      type: Actions.NAME_FRAMEGROUP,
      payload: {
        ...activeFrameGroup,
        name,
      },
    });
  };

  const exportJson = (what: ExportTypes) => {
    dispatch<ExportJSONAction>({
      type: Actions.JSON_EXPORT,
      payload: what,
      selectedFrameGroup,
    });
  };

  return {
    selectedFrameGroup,
    groupFrames,
    setSelectedFrameGroup,
    frameGroups,
    exportJson,
    palette: palette?.palette,
    setActiveFrameGroupName,
    activeFrameGroup,
  };
};

export default useFrames;
