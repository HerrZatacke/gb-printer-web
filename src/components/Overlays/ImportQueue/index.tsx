import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import React from 'react';
import { FixedSizeList } from 'react-window';
import FrameSelect from '@/components/FrameSelect';
import PaletteSelect from '@/components/PaletteSelect';
import TagsSelect from '@/components/TagsSelect';
import useRunImport from '@/hooks/useRunImport';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
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
    lastSeenCount,
    importedDuplicatesCount,
    queueDuplicatesCount,
    deletedCount,
    removeLastSeen,
    removeDeleted,
    removeImportedDuplicates,
    removeQueueDuplicates,
  } = useRunImport();

  const { height } = useScreenDimensions();

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
        <FixedSizeList
          height={Math.min(importQueue.length * 152, height / 2)}
          itemCount={importQueue.length}
          itemSize={152}
          overscanCount={5}
          width="100%"
        >
          {({ index, style }) => (
            <ImportRow
              windowStyle={style}
              palette={palette}
              importItem={importQueue[index]}
              importAsFrame={() => importAsFrame(importQueue[index].tempId)}
              cancelItemImport={() => cancelItemImport(importQueue[index].tempId)}
            />
          )}
        </FixedSizeList>
        <ButtonGroup
          variant="contained"
          color="secondary"
          fullWidth
        >
          <Button
            disabled={!lastSeenCount}
            onClick={removeLastSeen}
            title="Remove last seen"
          >
            {`Remove last seen ${lastSeenCount ? `(${lastSeenCount})` : ''}`}
          </Button>
          <Button
            disabled={!deletedCount}
            onClick={removeDeleted}
            title="Remove deleted"
          >
            {`Remove deleted ${deletedCount ? `(${deletedCount})` : ''}`}
          </Button>
          <Button
            disabled={!queueDuplicatesCount}
            onClick={removeQueueDuplicates}
            title="Remove duplicates in queue"
          >
            {`Remove duplicates in queue ${queueDuplicatesCount ? `(${queueDuplicatesCount})` : ''}`}
          </Button>
          <Button
            disabled={!importedDuplicatesCount}
            onClick={removeImportedDuplicates}
            title="Remove already imported"
          >
            {`Remove already imported ${importedDuplicatesCount ? `(${importedDuplicatesCount})` : ''}`}
          </Button>
        </ButtonGroup>
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
