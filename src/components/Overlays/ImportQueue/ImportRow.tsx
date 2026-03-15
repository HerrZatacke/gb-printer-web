import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge, { type BadgeOwnProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { type RowComponentProps } from 'react-window';
import GameBoyImage from '@/components/GameBoyImage';
import { useDateFormat } from '@/hooks/useDateFormat';
import { type FlaggedImportItem } from '@/types/ImportItem';
import { type Palette } from '@/types/Palette';

interface Props {
  importQueue: FlaggedImportItem[],
  palette: Palette,
  importAsFrame: (id: string) => void,
  cancelItemImport: (id: string) => void,
}

function ImportRow({
  ariaAttributes,
  index,
  style,
  importQueue,
  palette,
  importAsFrame,
  cancelItemImport,
}: Props & RowComponentProps) {
  const t = useTranslations('ImportRow');

  const importItem = useMemo(() => importQueue[index], [importQueue, index]);

  const {
    tiles,
    fileName,
    lastModified,
    alreadyImported,
    isDuplicateInQueue,
    tempId,
  } = importItem;

  const badgeProps = useMemo<BadgeOwnProps>(() => {
    if (isDuplicateInQueue) {
      return {
        color: 'error',
        title: t('duplicateInQueue'),
        badgeContent: 'D',
      };
    }

    if (alreadyImported) {
      return {
        color: 'warning',
        title: t('alreadyImported', { title: alreadyImported.title || 'NO_TITLE' }),
        badgeContent: 'I',
      };
    }

    return {};
  }, [alreadyImported, isDuplicateInQueue, t]);

  const { formatter } = useDateFormat();

  return (
    <Stack
      direction="row"
      component="li"
      gap={1}
      alignItems="stretch"
      justifyContent="left"
      sx={style}
      {...ariaAttributes}
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
            title={t('importAsFrame')}
            disabled={tiles.length / 20 < 14}
            onClick={() => importAsFrame(tempId)}
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
              title={t('removeFromQueue')}
              onClick={() => setTimeout(() => {
                cancelItemImport(tempId);
              }, 1)}
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

export default ImportRow;
