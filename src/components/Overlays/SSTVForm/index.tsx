import { MenuItem, Stack, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import Lightbox from '@/components/Lightbox';
import { useSSTV } from '@/hooks/useSSTV';
import { useInteractionsStore } from '@/stores/stores';
import { ModeType } from '@/tools/sstv';

function SSTVForm() {
  const t = useTranslations('SSTVForm');

  const { setSSTVHash, sstvHash } = useInteractionsStore();
  const {
    modeType,
    setModeType,
    audioSource,
    filename,
  } = useSSTV();

  const visible = !!sstvHash;

  const modeTypes = useMemo(() => ([
    { title: t('modeType.martin1'), key: ModeType.MARTIN_1 },
    { title: t('modeType.martin2'), key: ModeType.MARTIN_2 },
    // { title: t('modeType.robot32'), key: ModeType.ROBOT_32 },
    // { title: t('modeType.robot36'), key: ModeType.ROBOT_36 },
    // { title: t('modeType.robot72'), key: ModeType.ROBOT_72 },
  ]), [t]);

  if (!visible) {
    return null;
  }

  return (
    <Lightbox
      header={t('dialogHeader')}
      // confirm={() => formSetSortBy(`${sortBy}_${sortOrder}`)}
      deny={() => setSSTVHash('')}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label={t('modeTypeLabel')}
          size="small"
          select
          value={modeType}
          onChange={(ev) => setModeType(ev.target.value as ModeType)}
        >
          { modeTypes.map(({ key, title }) => (
            <MenuItem key={key} value={key}>{ title }</MenuItem>
          )) }
        </TextField>
        <AudioPlayer
          audioSource={audioSource}
          downloadFilename={filename}
        />
      </Stack>
    </Lightbox>
  );
}

export default SSTVForm;
