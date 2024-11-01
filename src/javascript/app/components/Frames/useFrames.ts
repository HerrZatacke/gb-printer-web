import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsStore from '../../stores/settingsStore';
import getFrameGroups from '../../../tools/getFrameGroups';
import { Actions } from '../../store/actions';
import type { FrameGroup } from '../../../../types/FrameGroup';
import type { FrameGroupNamesAction } from '../../../../types/actions/FrameActions';
import type { State } from '../../store/State';
import type { Frame } from '../../../../types/Frame';
import type { ExportJSONAction } from '../../../../types/actions/StorageActions';
import type { ExportTypes } from '../../../consts/exportTypes';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { compressAndHashFrame, loadFrameData, saveFrameData } from '../../../tools/applyFrame/frameData';
import { padFrameData } from '../../../tools/saveLocalStorageItems';

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
  convertFormat: () => void,
  enableDebug: boolean,
}

const useFrames = (): UseFrames => {
  const dispatch = useDispatch();
  const { enableDebug, savFrameTypes, activePalette } = useSettingsStore();

  const {
    frames,
    frameGroupNames,
    palette,
  } = useSelector((state: State) => ({
    frames: state.frames,
    frameGroupNames: state.frameGroupNames,
    palette: state.palettes.find(({ shortName }) => shortName === activePalette) || state.palettes[0],
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

  const convertFormat = async () => {
    const updatedFrames = await Promise.all(frames.map(async (frame): Promise<Frame> => {
      const stateData = await loadFrameData(frame.hash);

      if (!stateData) {
        return frame;
      }

      const imageStartLine = stateData.upper.length / 20;
      const tileData = padFrameData(stateData);

      const { dataHash: newHash } = await compressAndHashFrame(tileData, imageStartLine);


      if (frame.hash === newHash) {
        return frame;
      }

      const saveHash = await saveFrameData(tileData, imageStartLine);

      return {
        ...frame,
        hash: saveHash,
      };
    }));

    dispatch<GlobalUpdateAction>({
      type: Actions.GLOBAL_UPDATE,
      payload: {
        frames: updatedFrames,
      },
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
    convertFormat,
    enableDebug,
  };
};

export default useFrames;
