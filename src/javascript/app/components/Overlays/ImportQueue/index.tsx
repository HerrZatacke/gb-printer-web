import React from 'react';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import useRunImport from './useRunImport';
import TagsSelect from '../../TagsSelect';
import modifyTagChanges from '../../../../tools/modifyTagChanges';
import SVG from '../../SVG';

import './index.scss';

function ImportQueue() {
  const {
    frame,
    palette,
    importQueue,
    tagChanges,
    createGroup,
    setFrame,
    setActivePalette,
    setCreateGroup,
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
          onChange={setActivePalette}
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
        <label
          className={
            classnames('import-overlay__checkgroup inputgroup checkgroup', {
              'checkgroup--checked': createGroup,
            })
          }
        >
          <span
            className="inputgroup__label"
            title="Create group from images"
          >
            Create group from images
          </span>
          <span
            className="checkgroup__checkbox-wrapper"
          >
            <input
              type="checkbox"
              className="checkgroup__input"
              checked={createGroup}
              onChange={({ target }) => {
                setCreateGroup(target.checked);
              }}
            />
            <SVG name="checkmark" />
          </span>
        </label>
      </div>
    </Lightbox>
  );
}

export default ImportQueue;
