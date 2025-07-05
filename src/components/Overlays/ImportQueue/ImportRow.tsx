import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge, { type BadgeOwnProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import React, { useMemo, memo, type CSSProperties } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import useSettingsStore from '@/stores/settingsStore';
import dateFormatLocale from '@/tools/dateFormatLocale';
import type { FlaggedImportItem } from '@/types/ImportItem';
import type { Palette } from '@/types/Palette';

interface Props {
  importItem: FlaggedImportItem,
  windowStyle: CSSProperties,
  palette: Palette,
  importAsFrame: () => void,
  cancelItemImport: () => void,
}

function ImportRow({
  importItem,
  palette,
  importAsFrame,
  cancelItemImport,
  windowStyle,
}: Props) {
  const { preferredLocale } = useSettingsStore();

  const {
    tiles,
    fileName,
    lastModified,
    alreadyImported,
    isDuplicateInQueue,
  } = importItem;

  const badgeProps = useMemo<BadgeOwnProps>(() => {
    if (isDuplicateInQueue) {
      return {
        color: 'error',
        title: 'This image exists multiple times within this queue',
        badgeContent: 'D',
      };
    }

    if (alreadyImported) {
      return {
        color: 'warning',
        title: `This image has already been imported${alreadyImported.title ? ` as "${alreadyImported.title}"` : ''}`,
        badgeContent: 'I',
      };
    }

    return {};
  }, [alreadyImported, isDuplicateInQueue]);

  return (
    <Stack
      direction="row"
      gap={2}
      alignItems="center"
      justifyContent="space-between"
      sx={windowStyle}
    >
      <Box
        sx={{ flex: '160px 0 0' }}
      >
        <GameBoyImage
          tiles={tiles}
          invertPalette={false}
          lockFrame={false}
          palette={palette?.palette}
          imageStartLine={2}
          asThumb
        />
      </Box>

      <Box sx={{ flex: 'auto 1 1' }}>
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

      <ButtonGroup
        sx={{ flex: '40px 0 0' }}
        orientation="vertical"
      >
        <IconButton
          title="Import image as frame"
          disabled={tiles.length / 20 < 14}
          onClick={importAsFrame}
        >
          <CropFreeIcon />
        </IconButton>
        <Badge
          {...badgeProps}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          overlap="circular"
        >
          <IconButton
            title="Remove image from queue"
            onClick={() => setTimeout(cancelItemImport, 1)}
          >
            <DeleteIcon />
          </IconButton>
        </Badge>
      </ButtonGroup>
    </Stack>
  );
}

export default memo(ImportRow);
