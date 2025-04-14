import React from 'react';
import dayjs from 'dayjs';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { dateFormat } from '../../../defaults';
import dateFormatLocale from '../../../../tools/dateFormatLocale';
import Lightbox from '../../Lightbox';
import ImageRender from '../../ImageRender';
import { useLightboxImage } from './useLightboxImage';
import type { RGBNImage } from '../../../../../types/Image';

import './index.scss';

function LightboxImage() {
  const {
    image,
    isFullscreen,
    currentIndex,
    size,
    preferredLocale,
    canPrev,
    canNext,
    prev,
    next,
    fullscreen,
    close,
  } = useLightboxImage();

  return (
    <Lightbox
      header={image?.title}
      deny={close}
      contentWidth="100%"
      contentHeight="100%"
      fullSize
      headerActionButtons={(
        <IconButton
          color="inherit"
          onClick={fullscreen}
          title={isFullscreen ? 'Leave fullscreen' : 'Enter fullscreen'}
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

                '.gameboy-image': {
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                },

                '.gameboy-image canvas': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                },
              }}
            >
              <ImageRender
                lockFrame={image.lockFrame}
                invertPalette={image.invertPalette}
                invertFramePalette={image.invertFramePalette}
                palette={image.palette}
                framePalette={image.framePalette}
                frameId={image.frame}
                hash={image.hash}
                hashes={(image as RGBNImage).hashes}
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
            { `Image ${currentIndex + 1}/${size}` }
          </Typography>
          <Typography variant="body2">
            {dateFormatLocale(dayjs(image?.created, dateFormat), preferredLocale)}
          </Typography>
        </Stack>

      </Stack>
    </Lightbox>
  );
}

export default LightboxImage;
