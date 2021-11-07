import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFrameGroups from '../../../tools/getFrameGroups';
import { DELETE_FRAME } from '../../store/actions';

const prioId = (id) => {
  switch (id) {
    case 'int':
      return '_1';
    case 'jp':
      return '_2';
    case 'hk':
      return '_3';
    default:
      return id;
  }
};

const useFrames = () => {
  const dispatch = useDispatch();
  const savFrameTypes = useSelector((state) => state.savFrameTypes);
  const frames = useSelector((state) => state.frames);
  const palette = useSelector((state) => state.palettes.find(({ shortName }) => shortName === state.activePalette));
  const [frameGroups, setFrameGroups] = useState([]);
  const [groupFrames, setGroupFrames] = useState([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(savFrameTypes);

  useEffect(() => {
    const groups = getFrameGroups(frames)
      .sort(({ id: ida }, { id: idb }) => {
        const sorta = prioId(ida);
        const sortb = prioId(idb);

        if (sorta > sortb) {
          return 1;
        }

        if (sorta < sortb) {
          return -1;
        }

        return 0;
      });

    setFrameGroups(groups);

  }, [frames]);

  useEffect(() => {
    if (selectedFrameGroup) {
      setGroupFrames(frames.filter(({ id }) => id.startsWith(selectedFrameGroup)));
    } else {
      setGroupFrames([]);
    }
  }, [frames, selectedFrameGroup]);

  const deleteFrame = (id) => dispatch({
    type: DELETE_FRAME,
    payload: id,
  });


  return {
    selectedFrameGroup,
    groupFrames,
    setSelectedFrameGroup,
    frameGroups,
    palette: palette.palette,
    deleteFrame,
  };
};

export default useFrames;
