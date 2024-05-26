import React from 'react';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import useRunImport from './useRunImport';
import TagsSelect from '../../TagsSelect';
import modifyTagChanges from '../../../../tools/modifyTagChanges';

import './index.scss';

const ImportQueue = () => {
  const {
    frame,
    palette,
    importQueue,
    tagChanges,
    setFrame,
    setPalette,
    updateTagChanges,
    runImport,
    cancelImport,
  } = useRunImport();

  return (
    <Lightbox
      className="import-overlay"
      header={`Image Import (${importQueue.length} images)`}
      confirm={runImport}
      deny={cancelImport}
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
                importItem={image}
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
