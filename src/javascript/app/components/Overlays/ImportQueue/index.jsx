import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import { IMPORTQUEUE_CANCEL } from '../../../store/actions';
import './index.scss';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';

const ImportQueue = () => {
  const importQueue = useSelector((store) => store.importQueue);
  const dispatch = useDispatch();
  const activePalette = useSelector((state) => (state.activePalette));
  const [frame, setFrame] = useState('');
  const [palette, setPalette] = useState(activePalette);

  return (
    <Lightbox
      className="import-overlay"
      header="Image Import"
      confirm={() => {}}
      deny={() => {
        dispatch({ type: IMPORTQUEUE_CANCEL });
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
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...image}
              />
            ))
          }
        </ul>
        <FrameSelect
          selectLabel="Use frame for import"
          frame={frame}
          lockFrame={false}
          noFrameOption="No frame / import as is"
          updateFrame={setFrame}
        />
        <PaletteSelect
          selectLabel="Palette"
          noFancy
          value={palette}
          onChange={setPalette}
        />
      </div>
    </Lightbox>
  );
};

export default ImportQueue;
