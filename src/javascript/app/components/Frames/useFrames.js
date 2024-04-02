import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFrameGroups from '../../../tools/getFrameGroups';
import { Actions } from '../../store/actions';

const getValidFrameGroupId = (groups, byId) => {
  const group = groups.find(({ id }) => id === byId);
  if (!group) {
    return groups[0]?.id || '';
  }

  return group.id;
};

const useFrames = () => {
  const dispatch = useDispatch();
  const savFrameTypes = useSelector((state) => state.savFrameTypes);
  const frames = useSelector((state) => state.frames);
  const frameGroupNames = useSelector((state) => state.frameGroupNames);
  const palette = useSelector((state) => state.palettes.find(({ shortName }) => shortName === state.activePalette));
  const frameGroups = getFrameGroups(frames, frameGroupNames);
  const [groupFrames, setGroupFrames] = useState([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(getValidFrameGroupId(frameGroups, savFrameTypes));

  useEffect(() => {
    if (selectedFrameGroup) {
      setGroupFrames(frames.filter(({ id }) => {
        try {
          const frameGroupIdRegex = /^(?<group>[a-z]+)(?<id>[0-9]+)/g;
          const { groups: { group } } = frameGroupIdRegex.exec(id);
          return selectedFrameGroup === group;
        } catch (error) {
          return false;
        }
      }));
    } else {
      setGroupFrames([]);
    }
  }, [frames, selectedFrameGroup]);

  const activeFrameGroup = frameGroups.find(({ id }) => (id === selectedFrameGroup));

  const setActiveFrameGroupName = (name) => {
    dispatch({
      type: Actions.NAME_FRAMEGROUP,
      payload: {
        ...activeFrameGroup,
        name,
      },
    });
  };

  const exportJson = (what) => {
    dispatch({
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
    palette: palette.palette,
    setActiveFrameGroupName,
    activeFrameGroup,
  };
};

export default useFrames;
