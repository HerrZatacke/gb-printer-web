import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import { Actions } from '../../../store/actions';
import './index.scss';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import useRunImport from './useRunImport';
import TagsSelect from '../../TagsSelect';
import modifyTagChanges from '../../../../tools/modifyTagChanges';

const ImportQueue = () => {
  const importQueue = useSelector((store) => store.importQueue);
  const dispatch = useDispatch();
  const palette = useSelector((state) => (state.activePalette));
  const [frame, setFrame] = useState('');

  const setPalette = (payload) => {
    dispatch({
      type: Actions.PALETTE_SET_ACTIVE,
      payload,
    });
  };

  const [tagChanges, updateTagChanges] = useState({
    initial: [],
    add: [],
    remove: [],
  });
  const { runImport } = useRunImport();

  return (
    <Lightbox
      className="import-overlay"
      header={`Image Import (${importQueue.length} images)`}
      confirm={() => runImport({
        importQueue,
        palette,
        frame,
        tags: tagChanges.add,
      })}
      deny={() => {
        dispatch({ type: Actions.IMPORTQUEUE_CANCEL });
      }}
    >
      <div
        className="import-overlay__content"
      >
        <ul
          className="import-overlay__images"
        >
          {
            importQueue.map((image, index) => (
              <ImportRow
                key={index}
                paletteShort={palette}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...image}
              />
            ))
          }
        </ul>
        <PaletteSelect
          selectLabel="Palette"
          noFancy
          value={palette}
          onChange={setPalette}
        />
        <FrameSelect
          selectLabel="Modify Frame"
          frame={frame}
          lockFrame={false}
          noFrameOption="No frame / import as is"
          updateFrame={setFrame}
        />
        <TagsSelect
          label="Tags"
          tags={tagChanges}
          listDirection="up"
          updateTags={(mode, tag) => {
            updateTagChanges({
              ...tagChanges,
              ...modifyTagChanges(tagChanges, { mode, tag }),
            });
          }}
        />
      </div>
    </Lightbox>
  );
};

export default ImportQueue;
