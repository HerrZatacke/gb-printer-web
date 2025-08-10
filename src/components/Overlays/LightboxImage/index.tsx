import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import ImageRender from '@/components/ImageRender';
import Lightbox from '@/components/Lightbox';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useGalleryImage } from '@/hooks/useGalleryImage';
import { useLightboxImage } from '@/hooks/useLightboxImage';

function LightboxImage() {
  const t = useTranslations('LightboxImage');
  const {
    imageHash,
    isFullscreen,
    currentIndex,
    size,
    canPrev,
    canNext,
    prev,
    next,
    fullscreen,
    close,
  } = useLightboxImage();

  const { galleryImageData: image } = useGalleryImage(imageHash || '');

  const { formatter } = useDateFormat();

  if (!image) { return null; }

  return (
    <Lightbox
      header={image.title}
      deny={close}
      contentWidth="100%"
      contentHeight="100%"
      fullSize
      headerActionButtons={(
        <IconButton
          color="inherit"
          onClick={fullscreen}
          title={t(isFullscreen ? 'leaveFullscreen' : 'enterFullscreen')}
        >
          { isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon /> }
        </IconButton>
      )}
    >
      <Stack
        direction="column"
        gap={2}
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            '& > .MuiBox-root': {
              flexGrow: 1,
            },
          }}
        >

          <IconButton
            size="large"
            onClick={prev}
            disabled={!canPrev}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          { image && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                flexBasis: '100%',
                flexGrow: 1,
              }}
            >
              <ImageRender
                lockFrame={image.lockFrame}
                invertPalette={image.invertPalette}
                invertFramePalette={image.invertFramePalette}
                palette={image.palette}
                framePalette={image.framePalette}
                frameId={image.frame}
                hash={imageHash || ''}
                hashes={image.hashes}
                rotation={image.rotation}
              />
            </Box>
          )}

          <IconButton
            size="large"
            onClick={next}
            disabled={!canNext}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          gap={{ xs: 4, md: 12 }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2">
            {t('imageCounter', { current: currentIndex + 1, total: size })}
          </Typography>
          {image.created && (
            <Typography variant="body2">
              {formatter(image.created)}
            </Typography>
          )}
        </Stack>

      </Stack>
    </Lightbox>
  );
}

export default LightboxImage;
