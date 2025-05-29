import React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import TagsSelect from '../../TagsSelect';
import modifyTagChanges from '../../../../tools/modifyTagChanges';
import useRunImport from '../../../../hooks/useRunImport';

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
    resetTagChanges,
    runImport,
    cancelImport,
  } = useRunImport();

  return (
    <Lightbox
      header={`Image Import (${importQueue.length} images)`}
      confirm={runImport}
      deny={cancelImport}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <Stack
          direction="column"
          component="ul"
          gap={1}
        >
          {
            importQueue.map((image) => (
              <ImportRow
                key={image.tempId}
                paletteShort={palette}
                importItem={image}
              />
            ))
          }
        </Stack>
        <PaletteSelect
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
          tags={tagChanges}
          resetTags={resetTagChanges}
          updateTags={(mode, tag) => {
            updateTagChanges({
              ...tagChanges,
              ...modifyTagChanges(tagChanges, { mode, tag }),
            });
          }}
        />
        <FormControlLabel
          label="Create group from images at current location"
          control={(
            <Switch
              checked={createGroup}
              onChange={({ target }) => {
                setCreateGroup(target.checked);
              }}
            />
          )}
        />
      </Stack>
    </Lightbox>
  );
}

export default ImportQueue;
