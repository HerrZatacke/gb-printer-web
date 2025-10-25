import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import { CSSProperties, useEffect, useState } from 'react';
import React from 'react';
import useOverlayGlobalKeys from '@/hooks/useOverlayGlobalKeys';

interface Props {
  contentHeight?: number | string,
  contentWidth?: number | string,
  open?: boolean,
  keepMounted?: boolean,
  header?: string,
  closeTitle?: string,
  children?: React.ReactNode,
  fullSize?: boolean,
  confirm?: () => void,
  deny?: () => void,
  canConfirm?: boolean,
  headerOnly?: boolean,
  closeOnOverlayClick?: boolean,
  headerActionButtons?: React.ReactNode,
  actionButtons?: React.ReactNode,
}

const contentDimensions = (
  width: string | number | undefined,
  height: string | number | undefined,
  fullScreen: boolean,
  fullSize: boolean | undefined,
): CSSProperties => {
  const styles: CSSProperties = {};

  if (fullSize) {
    // MuiDialogTitle forces a padding, so !important is needed :(
    styles.padding = '8px !important';
    styles.overflowX = 'hidden';
    styles.overflowY = 'hidden';
  } else {
    styles.scrollbarGutter = 'stable';
    styles.overflowY = 'scroll';
  }

  if (fullScreen) {
    return styles;
  }

  switch (typeof height) {
    case 'string':
      styles.height = height;
      break;
    case 'number':
      styles.height = `${height}px`;
      break;
    default:
      break;
  }

  switch (typeof width) {
    case 'string':
      styles.width = width;
      break;
    case 'number':
      styles.width = `${width}px`;
      break;
    default:
      styles.width = '440px';
      break;
  }

  return styles;
};

function Lightbox({
  contentHeight,
  contentWidth,
  header,
  closeTitle,
  children,
  confirm,
  deny,
  canConfirm,
  headerOnly,
  fullSize,
  open: openProp,
  keepMounted: keepMountedProp,
  closeOnOverlayClick: closeOnClick,
  headerActionButtons,
  actionButtons,
}: Props) {
  const t = useTranslations('Lightbox');
  const closeOnOverlayClick = typeof closeOnClick !== 'boolean' ? true : closeOnClick;
  const open = typeof openProp !== 'boolean' ? true : openProp;
  const keepMounted = typeof keepMountedProp !== 'boolean' ? true : keepMountedProp;
  const [overlayContainer, setOverlayContainer] = useState<HTMLElement | undefined>();

  useOverlayGlobalKeys({
    confirm,
    canConfirm: canConfirm || false,
    deny,
  });

  useEffect(() => {
    setOverlayContainer(document.body);
  }, []);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const contentDimensionsSx = contentDimensions(contentWidth, contentHeight, fullScreen, fullSize);

  const denyText = Boolean(confirm) ? t('cancel') : t('close');
  const confirmText = t('ok');

  return (
    <Dialog
      container={overlayContainer}
      fullScreen={fullScreen || fullSize}
      maxWidth="lg"
      open={open}
      onClose={deny}
      aria-label={typeof header === 'string' ? header : undefined}
      keepMounted={keepMounted}
      disableEscapeKeyDown={!closeOnOverlayClick}
      sx={{
        // matching "scrollbar-width: thin;" on <html>
        paddingRight: '10px',
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          maxWidth: contentDimensionsSx.width,
        }}
      >
        <Box
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          title={header}
        >
          {header}
        </Box>
        <Stack
          direction="row"
          sx={{
            my: -0.5,
            mr: -2,
          }}
        >
          {headerActionButtons}
          {
            deny ? (
              <IconButton
                title={closeTitle || t('closeWithHeader', { header: typeof header === 'string' ? header : '' })}
                color="inherit"
                onClick={deny}
              >
                <CloseIcon />
              </IconButton>
            ) : null
          }
        </Stack>
      </DialogTitle>
      { !headerOnly && (
        <DialogContent
          sx={contentDimensionsSx}
        >
          {children}
        </DialogContent>
      ) }

      <DialogActions>
        { actionButtons }
        { deny ? (
          <Button
            onClick={deny}
            color="primary"
            variant="outlined"
          >
            {denyText}
          </Button>
        ) : null }
        { confirm ? (
          <Button
            disabled={canConfirm === false}
            color="primary"
            variant="contained"
            onClick={confirm}
          >
            {confirmText}
          </Button>
        ) : null }
      </DialogActions>
    </Dialog>
  );
}

export default Lightbox;
