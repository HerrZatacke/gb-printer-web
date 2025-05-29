/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import TextField from '@mui/material/TextField';
import type { SxProps } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import ImageRender from '../../ImageRender';
import EditImageTabs from '../../EditImageTabs';
import Lightbox from '../../Lightbox';
import { useEditForm } from '../../../../hooks/useEditForm';
import { getScrollParent } from '../../../../tools/getScrollParent';

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
    resetTags,
    save,
    cancel,
  } = useEditForm();

  const theme: Theme = useTheme();
  const [stickyBox, setStickyBox] = useState<HTMLElement | null>(null);
  const [stickyStyles, setStickyStyles] = useState<SxProps>({ top: theme.spacing(-2) });

  useEffect(() => {
    if (!stickyBox) {
      return () => { /**/ };
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const updateStyles = (target: HTMLElement) => {
      const minImageHeight = 144;
      const stickyBoundaries = stickyBox.getBoundingClientRect();
      const minScale = minImageHeight / stickyBoundaries.height;
      const baseScale = target.scrollTop / stickyBoundaries.height;
      const scale = Math.min(1, Math.max(minScale, 1 - baseScale));
      const top = Math.min(stickyBoundaries.height - minImageHeight, target.scrollTop);

      setStickyStyles({
        position: 'sticky',
        zIndex: 2,
        transition: 'top ease-in-out 150ms',
        transform: 'translateY(-16px)',
        top: `-${Math.round(top)}px`,

        '& .gameboy-image': {
          transformOrigin: 'center bottom',
          transition: 'transform ease-in-out 150ms',
          transform: `scale(${scale.toPrecision(4)})`,
        },
      });
    };

    updateStyles(stickyBox);

    const onParentScroll = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateStyles(event.target as HTMLElement);
      }, 50);
    };

    const scrollParent = getScrollParent(stickyBox);
    scrollParent.addEventListener('scroll', onParentScroll);

    return () => {
      clearTimeout(timeoutId);
      scrollParent.removeEventListener('scroll', onParentScroll);
    };
  }, [stickyBox]);

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
          ref={setStickyBox}
          sx={stickyStyles}
        >
          <Box
            sx={{
              mx: theme.spacing(-2),
              position: 'relative',
              backgroundColor: theme.palette.background.default,
            }}
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
                  top: '11%',
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
        </Box>
        <TextField
          helperText={toEdit.imageCount > 1 ? 'Use %n (or %nn, %nnn, ...) to add an index to the image titles' : undefined}
          type="text"
          label="Edit title"
          value={title}
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
          resetTags={resetTags}
        />
      </Stack>
    </Lightbox>
  );
}

export default EditForm;
