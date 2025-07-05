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
import useSettingsStore from '@/stores/settingsStore';
import modifyTagChanges from '@/tools/modifyTagChanges';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';

function ImportQueue() {
  const {
    frame,
    palette,
    activePalette,
    queue,
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
    removeLastSeen,
    removeDeleted,
  } = useRunImport();

  const { height } = useScreenDimensions();
  const { importLastSeen, importDeleted } = useSettingsStore();

  const showRemovalButtons = importLastSeen || importDeleted;

  return (
    <Lightbox
      header={`Image Import (${queue.length} images)`}
      confirm={runImport}
      deny={cancelImport}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <FixedSizeList
          height={Math.min(queue.length * 152, height / 2)}
          itemCount={queue.length}
          itemSize={152}
          overscanCount={5}
          width="100%"
        >
          {({ index, style }) => (
            <ImportRow
              windowStyle={style}
              palette={palette}
              imageId={queue[index]}
              importAsFrame={() => importAsFrame(queue[index])}
              cancelItemImport={() => cancelItemImport(queue[index])}
            />
          )}
        </FixedSizeList>
        {showRemovalButtons && (
          <ButtonGroup
            variant="contained"
            color="secondary"
            fullWidth
          >
            <Button
              disabled={!importLastSeen}
              onClick={removeLastSeen}
            >
              Remove [last seen]
            </Button>
            <Button
              disabled={!importDeleted}
              onClick={removeDeleted}
            >
              Remove [deleted]
            </Button>
          </ButtonGroup>
        )}
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
