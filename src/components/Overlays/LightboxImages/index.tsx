import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import LightBoxImage from '@/components/Overlays/LightboxImages/LightBoxImage';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useLightboxImage } from '@/hooks/useLightboxImage';

function LightboxImages() {
  const t = useTranslations('LightboxImage');
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const {
    currentInfo,
    lightboxImageHashes,
    isFullscreen,
    size,
    canPrev,
    canNext,
    prev,
    next,
    setCurrentIndex,
    handleFullscreen,
    close,
  } = useLightboxImage();

  const { formatter } = useDateFormat();

  const updateHandler = useCallback((() => {
    if (!containerNode || !currentInfo) { return; }

    const children = [...containerNode.childNodes] as HTMLDivElement[];
    children[currentInfo.index].scrollIntoView({
      behavior:'smooth',
      block:'nearest',
      inline:'center',
    });
  }), [containerNode, currentInfo]);

  useEffect(() => {
    if (!containerNode) { return; }

    const scrollHandler = () => {
      const index = Math.round(containerNode.scrollLeft / containerNode.offsetWidth);
      setCurrentIndex(index);
    };

    containerNode.addEventListener('scrollend', scrollHandler);
    window.addEventListener('resize', updateHandler);

    return () => {
      containerNode.removeEventListener('scrollend', scrollHandler);
      window.removeEventListener('resize', updateHandler);
    };
  }, [containerNode, setCurrentIndex, updateHandler]);

  useEffect(updateHandler, [updateHandler]);

  if (!lightboxImageHashes.length || !currentInfo) { return null; }

  return (
    <Lightbox
      header={currentInfo.title}
      deny={close}
      contentWidth="100%"
      contentHeight="100%"
      fullSize
      headerActionButtons={(
        <IconButton
          color="inherit"
          onClick={handleFullscreen}
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

          { currentInfo && (
            <Stack
              direction="row"
              gap={0}
              ref={setContainerNode}
              sx={{
                width: '100%',
                height: '100%',
                flexBasis: '100%',
                flexGrow: 1,
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                '&>.MuiBox-root': {
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  outline: 'none',
                },
              }}
            >
              {
                lightboxImageHashes.map((hash, index) => {
                  const renderContent = [currentInfo.index - 1, currentInfo.index, currentInfo.index + 1].includes(index);
                  return (
                    <LightBoxImage
                      key={hash}
                      hash={hash}
                      renderContent={renderContent}
                    />
                  );
                })
              }
            </Stack>
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
            {t('imageCounter', { current: currentInfo.index + 1, total: size })}
          </Typography>
          {currentInfo.created && (
            <Typography variant="body2">
              {formatter(currentInfo.created)}
            </Typography>
          )}
        </Stack>

      </Stack>
    </Lightbox>
  );
}

export default LightboxImages;
