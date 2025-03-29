/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import TextField from '@mui/material/TextField';
import ImageRender from '../../ImageRender';
import EditImageTabs from '../../EditImageTabs';
import Lightbox from '../../Lightbox';
import { useEditForm } from './useEditForm';
import { textFieldSlotDefaults } from '../../../../consts/textFieldSlotDefaults';

function EditForm() {
  const {
    toEdit,
    form,
    isRegularImage,
    willUpdateBatch,
    tagChanges,
    usedPalette,
    usedFramePalette,
    updateForm,
    updatePalette,
    updateFramePalette,
    updateTags,
    save,
    cancel,
  } = useEditForm();

  if (!toEdit) {
    console.warn('Editform should be open, but "toEdit" is undefined', toEdit);
    return null;
  }

  const {
    title,
    created,
    frame,
    lockFrame,
    rotation,
    invertPalette,
    invertFramePalette,
    framePaletteShort,
    paletteShort,
    paletteRGBN,
  } = form;

  return (
    <Lightbox
      contentHeight={toEdit.height}
      header={`Editing ${toEdit.imageCount} image(s)`}
      open
      confirm={save}
      deny={cancel}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <Box
          sx={(theme: Theme) => ({
            mx: theme.spacing(-2),
            mt: theme.spacing(-2),
            position: 'relative',
          })}
        >
          <ImageRender
            lockFrame={lockFrame}
            invertPalette={invertPalette}
            palette={usedPalette}
            invertFramePalette={invertFramePalette}
            framePalette={usedFramePalette}
            frameId={frame}
            hash={toEdit.hash}
            hashes={toEdit.hashes}
            rotation={rotation}
          />
          { toEdit.imageCount > 1 ? (
            <Alert
              severity="info"
              sx={{
                position: 'absolute',
                width: '75%',
                top: '21%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AlertTitle>
                { `You are editing ${toEdit.imageCount} images` }
              </AlertTitle>
              {
                willUpdateBatch.length ? (
                  <Box component="ul">
                    { willUpdateBatch.map((txt) => (
                      <Typography
                        key={txt}
                        component="li"
                        variant="caption"
                      >
                        { txt }
                      </Typography>
                    )) }
                  </Box>
                ) : null
              }
            </Alert>
          ) : null }

        </Box>
        <TextField
          helperText={toEdit.imageCount > 1 ? 'Use %n (or %nn, %nnn, ...) to add an index to the image titles' : undefined}
          type="text"
          label="Edit title"
          fullWidth
          size="small"
          value={title}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            ...textFieldSlotDefaults,
          }}
          onChange={({ target: { value } }) => {
            updateForm('title')(value);
          }}
        />
        <EditImageTabs
          created={created}
          updateCreated={updateForm('created')}
          regularImage={isRegularImage}
          mixedTypes={toEdit.mixedTypes}
          lockFrame={lockFrame}
          hash={toEdit.hash}
          hashes={toEdit.hashes}
          paletteShort={paletteShort}
          framePaletteShort={framePaletteShort}
          paletteRGBN={paletteRGBN}
          invertPalette={invertPalette}
          invertFramePalette={invertFramePalette}
          frame={frame}
          tags={tagChanges}
          meta={toEdit.meta}
          rotation={rotation}
          updatePalette={updatePalette}
          updateInvertPalette={updateForm('invertPalette')}
          updateFramePalette={updateFramePalette}
          updateInvertFramePalette={updateForm('invertFramePalette')}
          updateFrame={updateForm('frame')}
          updateFrameLock={updateForm('lockFrame')}
          updateRotation={updateForm('rotation')}
          updateTags={updateTags}
        />
      </Stack>
    </Lightbox>
  );
}

export default EditForm;
