import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge, { type BadgeOwnProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useMemo, memo, type CSSProperties } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import { useDateFormat } from '@/hooks/useDateFormat';
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

  const { formatter } = useDateFormat();

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="stretch"
      justifyContent="left"
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

      <Stack
        sx={{
          flex: 'auto 1 1',
          my: 1,
        }}
        direction="column"
        gap={2}
        justifyContent="space-between"
        alignContent="space-between"
      >
        <ButtonGroup
          fullWidth
          sx={{
            justifyContent: 'flex-end',
            display: 'flex',
          }}
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

        <Stack
          sx={{ pr: 1 }}
          gap={1}
          direction="column"
        >
          <Typography
            variant="caption"
            component="p"
            sx={{ wordBreak: 'break-word' }}
          >
            { fileName }
          </Typography>
          {
            lastModified && lastModified > 0 && (
              <Typography
                variant="caption"
                component="p"
              >
                { formatter(lastModified) }
              </Typography>
            )
          }
        </Stack>
      </Stack>
    </Stack>
  );
}

export default memo(ImportRow);
