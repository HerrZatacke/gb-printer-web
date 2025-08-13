import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import EditImageTabs from '@/components/EditImageTabs';
import ImageRender from '@/components/ImageRender';
import Lightbox from '@/components/Lightbox';
import { useEditForm } from '@/hooks/useEditForm';
import { useImageRender } from '@/hooks/useImageRender';
import { getScrollParent } from '@/tools/getScrollParent';

function EditForm() {
  const t = useTranslations('EditForm');
  const {
    toEdit,
    form,
    overrides,
    isRegularImage,
    willUpdateBatch,
    tagChanges,
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

  const { gbImageProps } = useImageRender(toEdit?.hash || '', overrides);

  if (!gbImageProps || !toEdit) {
    if (toEdit) {
      return (
        <Lightbox
          contentHeight={toEdit.height}
          header={t('dialogHeader', { count: toEdit.imageCount })}
          open
          deny={cancel}
        >
          <LinearProgress variant="indeterminate" />
        </Lightbox>
      );
    }

    console.warn('Editform should be open, but "toEdit" is undefined', toEdit, gbImageProps);
    return null;
  }

  return (
    <Lightbox
      contentHeight={toEdit.height}
      header={t('dialogHeader', { count: toEdit.imageCount })}
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
            <ImageRender hash={toEdit.hash} overrides={overrides} />
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
                  {t('editingMultiple', { count: toEdit.imageCount })}
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
          helperText={toEdit.imageCount > 1 ? t('indexHelperText') : undefined}
          type="text"
          label={t('editTitle')}
          value={form.title}
          onChange={({ target: { value } }) => {
            updateForm('title')(value);
          }}
        />
        <EditImageTabs
          created={form.created}
          updateCreated={updateForm('created')}
          regularImage={isRegularImage}
          mixedTypes={toEdit.mixedTypes}
          lockFrame={form.lockFrame}
          hash={toEdit.hash}
          hashes={toEdit.hashes}
          paletteShort={form.paletteShort}
          framePaletteShort={form.framePaletteShort}
          paletteRGBN={form.paletteRGBN}
          invertPalette={form.invertPalette}
          invertFramePalette={form.invertFramePalette}
          frame={form.frame}
          tags={tagChanges}
          meta={toEdit.meta}
          rotation={form.rotation}
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
