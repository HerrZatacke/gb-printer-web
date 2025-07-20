import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('ImportQueue');
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
      header={t('dialogHeader', { count: importQueue.length })}
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
            title={t('removeLastSeenTitle')}
          >
            {t('removeLastSeen', { count: lastSeenCount || 0 })}
          </Button>
          <Button
            disabled={!deletedCount}
            onClick={removeDeleted}
            title={t('removeDeletedTitle')}
          >
            {t('removeDeleted', { count: deletedCount || 0 })}
          </Button>
          <Button
            disabled={!queueDuplicatesCount}
            onClick={removeQueueDuplicates}
            title={t('removeDuplicatesInQueueTitle')}
          >
            {t('removeDuplicatesInQueue', { count: queueDuplicatesCount || 0 })}
          </Button>
          <Button
            disabled={!importedDuplicatesCount}
            onClick={removeImportedDuplicates}
            title={t('removeAlreadyImportedTitle')}
          >
            {t('removeAlreadyImported', { count: importedDuplicatesCount || 0 })}
          </Button>
        </ButtonGroup>
        <PaletteSelect
          noFancy
          value={activePalette}
          onChange={setActivePalette}
        />
        <FrameSelect
          selectLabel={t('modifyFrame')}
          frame={frame}
          lockFrame={false}
          noFrameOption={t('noFrameOption')}
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
          label={t('createGroupLabel')}
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
