import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge, { type BadgeOwnProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import useImportsStore from '@/stores/importsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import dateFormatLocale from '@/tools/dateFormatLocale';
import type { ImportItem } from '@/types/ImportItem';

interface Props {
  importItem: ImportItem,
  paletteShort: string,
}

function ImportRow({
  importItem,
  paletteShort,
}: Props) {
  const {
    tiles,
    fileName,
    lastModified,
    imageHash,
    tempId,
  } = importItem;

  const { palettes, images } = useItemsStore();
  const palette = palettes.find(({ shortName }) => shortName === paletteShort);
  const storeDuplicateImage = images.find(({ hash }) => hash === imageHash);

  const { importQueue } = useImportsStore();
  const queueDuplicates = importQueue.filter((item) => item.imageHash === imageHash).length;

  const { preferredLocale } = useSettingsStore();

  const { frameQueueAdd, importQueueCancelOne } = useImportsStore();

  const badgeProps = useMemo<BadgeOwnProps>(() => {
    if (queueDuplicates > 1) {
      return {
        color: 'error',
        title: 'This image exists multiple times within this queue',
        badgeContent: 'D',
      };
    }

    if (storeDuplicateImage) {
      return {
        color: 'warning',
        title: `This image has already been imported${storeDuplicateImage.title ? ` as "${storeDuplicateImage.title}"` : ''}`,
        badgeContent: 'I',
      };
    }

    return {};
  }, [queueDuplicates, storeDuplicateImage]);

  const stackSx = useMemo(() => ({
    '--zoom-image-top': 0,
    '--zoom-image-left': 0,
    '--zoom-image-width': '60px',
    '--zoom-image-z-index': 'initial',

    '& > *': {
      flexGrow: 1,
    },
  }), []);

  const boxSx = useMemo(() => ({
    height: `${tiles.length / 2.5 / 2.66}px`,
    flex: '60px 0 0',
    position: 'relative',

    '& > *': {
      top: 'var(--zoom-image-top)',
      left: 'var(--zoom-image-left)',
      width: 'var(--zoom-image-width)',
      zIndex: 'var(--zoom-image-z-index)',
      transition: 'width 150ms ease-in-out, left 150ms ease-in-out, top 150ms ease-in-out',
      position: 'absolute',
      outline: 'none',

      '@media (any-hover: none)': {
        '&:focus': {
          '--zoom-image-top': -12,
          '--zoom-image-left': -12,
          '--zoom-image-width': '160px',
          '--zoom-image-z-index': 2,
        },
      },
    },

    '@media (any-hover: hover)': {
      '& > *': {
        pointerEvents: 'none',
      },

      '&:hover': {
        '--zoom-image-top': -12,
        '--zoom-image-left': -12,
        '--zoom-image-width': '160px',
        '--zoom-image-z-index': 2,
      },
    },
  }), [tiles.length]);

  return (
    <Stack
      direction="row"
      gap={2}
      alignItems="center"
      justifyContent="space-between"
      component="li"
      sx={stackSx}
    >
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="left"
      >
        <Box
          sx={boxSx}
        >
          <Box tabIndex={window.matchMedia('(any-hover: none)').matches ? 0 : undefined}>
            <GameBoyImage
              tiles={tiles}
              invertPalette={false}
              lockFrame={false}
              palette={palette?.palette}
              imageStartLine={2}
              asThumb
            />
          </Box>
        </Box>

        <Box>
          <Typography
            variant="caption"
            component="p"
          >
            { fileName }
          </Typography>
          {
            lastModified && lastModified > 0 && (
              <Typography
                variant="caption"
                component="p"
              >
                { dateFormatLocale(dayjs(lastModified), preferredLocale) }
              </Typography>
            )
          }
        </Box>
      </Stack>

      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="right"
      >
        <Box>
          <ButtonGroup>
            <IconButton
              title="Import image as frame"
              disabled={tiles.length / 20 < 14}
              onClick={() => frameQueueAdd([importItem])}
            >
              <CropFreeIcon />
            </IconButton>
            <Badge
              {...badgeProps}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              overlap="circular"
            >
              <IconButton
                title="Remove image from queue"
                onClick={() => importQueueCancelOne(tempId)}
              >
                <DeleteIcon />
              </IconButton>
            </Badge>
          </ButtonGroup>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ImportRow;
