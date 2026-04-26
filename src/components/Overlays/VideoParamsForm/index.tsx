import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ExportFrameMode } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React from 'react';
import ExportFrameModeSelect from '@/components/ExportFrameModeSelect';
import FrameSelect from '@/components/FrameSelect';
import Lightbox from '@/components/Lightbox';
import PaletteSelect from '@/components/PaletteSelect';
import { useVideoForm } from '@/hooks/useVideoForm';

function VideoParamsForm() {
  const t = useTranslations('VideoParamsForm');

  const {
    update,
    cancel,
    imageCount,
    animate,
    videoParams,
  } = useVideoForm();

  if (!imageCount) {
    return null;
  }

  return (
    <Lightbox
      confirm={animate}
      deny={cancel}
      header={t('dialogHeader', { count: imageCount })}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label={t('frameRate')}
          size="small"
          type="number"
          slotProps={{
            htmlInput: { min: 1, max: 120 },
          }}
          value={videoParams.frameRate}
          onChange={(ev) => {
            update({ frameRate: parseInt(ev.target.value, 10) });
          }}
        />
        <TextField
          label={t('scaleGif')}
          size="small"
          type="number"
          slotProps={{
            htmlInput: { min: 1, max: 12 },
          }}
          value={videoParams.scaleFactor}
          onChange={(ev) => {
            update({ scaleFactor: parseInt(ev.target.value, 10) });
          }}
        />
        <FormControlLabel
          label={t('enableYoyo')}
          control={(
            <Switch
              checked={videoParams.yoyo}
              onChange={(ev) => {
                update({ yoyo: ev.target.checked });
              }}
            />
          )}
        />
        <FormControlLabel
          label={t('reverseDirection')}
          control={(
            <Switch
              checked={videoParams.reverse}
              onChange={(ev) => {
                update({ reverse: ev.target.checked });
              }}
            />
          )}
        />
        <PaletteSelect
          noFancy
          allowEmpty
          value={videoParams.palette || ''}
          invertPalette={videoParams.invertPalette}
          onChange={(palette) => {
            update({ palette });
          }}
          updateInvertPalette={(invertPalette) => {
            update({ invertPalette });
          }}
        />
        <ExportFrameModeSelect
          label={t('handleFrames')}
          frameMode={videoParams.exportFrameMode || ExportFrameMode.FRAMEMODE_KEEP}
          onFrameModeChange={(exportFrameMode) => update({ exportFrameMode })}
        />
        { videoParams.exportFrameMode === 'crop' ? null : (
          <FrameSelect
            frame={videoParams.frame || ''}
            lockFrame={videoParams.lockFrame}
            noFrameOption={t('noFrameOption')}
            updateFrame={(frame) => {
              update({ frame });
            }}
            updateFrameLock={(lockFrame) => {
              update({ lockFrame });
            }}
          />
        )}
      </Stack>
    </Lightbox>
  );
}

export default VideoParamsForm;
