import { MenuItem, Stack, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import Debug from '@/components/Debug';
import ExportFrameModeSelect from '@/components/ExportFrameModeSelect';
import Lightbox from '@/components/Lightbox';
import { useSSTV } from '@/hooks/useSSTV';
import { useInteractionsStore } from '@/stores/stores';
import { ModeType } from '@/tools/sstv';

const clampMin = 0;
const clampMax = 5000;

const clampNumberToString = (value: string): string => {
  const numeric = parseInt(value, 10);

  if (isNaN(numeric)) {
    return '0';
  }

  const clamped = Math.min(clampMax, Math.max(clampMin, numeric));
  return clamped.toString(10);
};

function SSTVForm() {
  const t = useTranslations('SSTVForm');

  const { setSSTVHash, sstvHash } = useInteractionsStore();
  const {
    modeType,
    setModeType,
    audioSource,
    filename,
    sstvSettings,
    silenceMs,
    setSilenceMs,
    frameMode,
    setFrameMode,
  } = useSSTV();

  const visible = !!sstvHash;

  const modeTypes = useMemo(() => ([
    { title: 'Martin 1', key: ModeType.MARTIN_1, disabled: false },
    { title: 'Martin 2', key: ModeType.MARTIN_2, disabled: false },
    // { title: 'Robot 8', key: ModeType.ROBOT_8, disabled: true },
    // { title: 'Robot 12', key: ModeType.ROBOT_12, disabled: true },
    // { title: 'Robot 24', key: ModeType.ROBOT_24, disabled: true },
    { title: 'Robot 36', key: ModeType.ROBOT_36, disabled: false },
    { title: 'Robot 72', key: ModeType.ROBOT_72, disabled: false },
    { title: 'Scottie 1', key: ModeType.SCOTTIE_1, disabled: true },
    { title: 'Scottie 2', key: ModeType.SCOTTIE_2, disabled: true },
    { title: 'Scottie DX', key: ModeType.SCOTTIE_DX, disabled: true },
  ]), []);

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
          { modeTypes.map(({ key, title, disabled }) => (
            <MenuItem key={key} value={key} disabled={disabled}>{ title }</MenuItem>
          )) }
        </TextField>

        <ExportFrameModeSelect
          label={t('handleFrame')}
          frameMode={frameMode}
          onFrameModeChange={setFrameMode}
        />

        <TextField
          size="small"
          value={silenceMs}
          type="number"
          label={t('addSilence')}
          slotProps={{
            htmlInput: { min: clampMin, max: clampMax, step: 500 },
          }}
          onChange={(ev) => setSilenceMs(ev.target.value)}
          onBlur={(ev) => setSilenceMs(clampNumberToString(ev.target.value))}
        />

        <AudioPlayer
          audioSource={audioSource}
          downloadFilename={filename}
        />
        {(typeof sstvSettings?.visCode !== 'undefined') && (
          <Debug text={`Vis Code: ${sstvSettings.visCode} / 0b${(sstvSettings.visCode).toString(2).padStart(7, '0')}`} />
        )}
      </Stack>
    </Lightbox>
  );
}

export default SSTVForm;
