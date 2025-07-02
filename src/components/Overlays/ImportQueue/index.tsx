import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import React from 'react';
import FrameSelect from '@/components/FrameSelect';
import PaletteSelect from '@/components/PaletteSelect';
import TagsSelect from '@/components/TagsSelect';
import useRunImport from '@/hooks/useRunImport';
import modifyTagChanges from '@/tools/modifyTagChanges';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';

function ImportQueue() {
  const {
    frame,
    palette,
    activePalette,
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
    importAsFrame,
    cancelItemImport,
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
                palette={palette}
                importItem={image}
                importAsFrame={() => importAsFrame(image)}
                cancelItemImport={() => cancelItemImport(image.tempId)}
              />
            ))
          }
        </Stack>
        <PaletteSelect
          noFancy
          value={activePalette}
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
