import CancelIcon from '@mui/icons-material/Cancel';
import Badge, { type BadgeOwnProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { type Palette } from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { type RowComponentProps } from 'react-window';
import GameBoyImage from '@/components/GameBoyImage';
import { useDateFormat } from '@/hooks/useDateFormat';
import { type FlaggedImportItem } from '@/types/ImportItem';

interface Props {
  importQueue: FlaggedImportItem[];
  palette: Palette;
  importAsFrame: (id: string) => void;
  cancelItemImport: (id: string) => void;
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
      sx={{
        ...style,
        gap: 1,
        alignItems: 'stretch',
        justifyContent: 'left',
      }}
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
          gap: 2,
          justifyContent: 'space-between',
          alignContent: 'space-between',
          flex: 'auto 1 1',
          my: 1,
        }}
        direction="column"
      >
        <ButtonGroup
          fullWidth
          sx={{
            justifyContent: 'flex-end',
            display: 'flex',
          }}
        >
          <IconButton
            size="large"
            title={t('importAsFrame')}
            disabled={tiles.length / 20 < 14}
            onClick={() => importAsFrame(tempId)}
          >
            <SvgIcon>
              <path d="M4.5 2.5c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-15c0-1.1-.9-2-2-2zm0 3.5h15v12h-15z" />
            </SvgIcon>
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
              size="large"
              title={t('removeFromQueue')}
              onClick={() => setTimeout(() => {
                cancelItemImport(tempId);
              }, 1)}
            >
              <CancelIcon />
            </IconButton>
          </Badge>
        </ButtonGroup>

        <Stack
          direction="column"
          sx={{
            gap: 1,
            pr: 1,
          }}
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
