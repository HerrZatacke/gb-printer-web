import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFrameGroups from '../../../tools/getFrameGroups';
import { JSON_EXPORT } from '../../store/actions';

const useFrames = () => {
  const dispatch = useDispatch();
  const savFrameTypes = useSelector((state) => state.savFrameTypes);
  const frames = useSelector((state) => state.frames);
  const palette = useSelector((state) => state.palettes.find(({ shortName }) => shortName === state.activePalette));
  const [frameGroups, setFrameGroups] = useState([]);
  const [groupFrames, setGroupFrames] = useState([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(savFrameTypes);

  useEffect(() => {
    const groups = getFrameGroups(frames);

    // if globally selected group does not exist, switch to the first existing
    if (!groups.find(({ id }) => id === savFrameTypes)) {
      setSelectedFrameGroup(groups[0]?.id || '');
    }

    setFrameGroups(groups);

  }, [frames, savFrameTypes]);

  useEffect(() => {
    if (selectedFrameGroup) {
      setGroupFrames(frames.filter(({ id }) => id.startsWith(selectedFrameGroup)));
    } else {
      setGroupFrames([]);
    }
  }, [frames, selectedFrameGroup]);

  const exportJson = (what) => {
    dispatch({
      type: JSON_EXPORT,
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
  };
};

export default useFrames;
