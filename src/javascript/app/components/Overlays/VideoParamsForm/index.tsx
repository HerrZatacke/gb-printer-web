import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import type { ExportFrameMode } from 'gb-image-decoder';
import Lightbox from '../../Lightbox';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import exportFrameModes from '../../../../consts/exportFrameModes';
import { useVideoForm } from './useVideoForm';

function VideoParamsForm() {

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
      header={`Create an animated GIF with ${imageCount} frames`}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label="Framerate"
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
          label="Scale GIF"
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
          label="Enable Yoyo-Effect (loop back to the beginning)"
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
          label="Reverse animation direction"
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
        <TextField
          label="How to handle frames when exporting images"
          size="small"
          select
          value={videoParams.exportFrameMode}
          onChange={(ev) => {
            update({ exportFrameMode: ev.target.value as ExportFrameMode });
          }}
        >
          {
            exportFrameModes.map(({ id, name }) => (
              <MenuItem value={id} key={id}>{ name }</MenuItem>
            ))
          }
        </TextField>
        { videoParams.exportFrameMode === 'crop' ? null : (
          <FrameSelect
            frame={videoParams.frame || ''}
            lockFrame={videoParams.lockFrame}
            noFrameOption="As selected per image"
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
