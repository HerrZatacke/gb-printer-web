import React from 'react';
import type { CSSProperties } from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useOverlayGlobalKeys from '../../../hooks/useOverlayGlobalKeys';
import useAutoFocus from '../../../hooks/useAutoFocus';
import './index.scss';

interface Props {
  contentHeight?: number | string,
  contentWidth?: number | string,
  // eslint-disable-next-line react/no-unused-prop-types
  className?: string,
  open?: boolean,
  header?: string,
  closeTitle?: string,
  children?: React.ReactNode,
  confirm?: () => void,
  deny?: () => void,
  canConfirm?: boolean,
  headerOnly?: boolean,
  closeOnOverlayClick?: boolean,
  actionButtons?: React.ReactNode,
}

const contentDimensions = (
  width: string | number | undefined,
  height: string | number | undefined,
): CSSProperties => {
  const styles: CSSProperties = {};

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

const overlayContainer = document.body;

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
  open: openProp,
  closeOnOverlayClick: closeOnClick,
  actionButtons,
}: Props) {
  const closeOnOverlayClick = typeof closeOnClick !== 'boolean' ? true : closeOnClick;
  const open = typeof openProp !== 'boolean' ? true : openProp;

  useOverlayGlobalKeys({
    confirm,
    canConfirm: canConfirm || false,
    deny,
  });

  const {
    autofocusRef,
  } = useAutoFocus();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      container={overlayContainer}
      fullScreen={fullScreen}
      maxWidth="lg"
      open={open}
      onClose={deny}
      aria-label={typeof header === 'string' ? header : undefined}
      keepMounted
      disableEscapeKeyDown={!closeOnOverlayClick}
    >
      <DialogTitle
        sx={{
          paddingRight: 8,
        }}
      >
        {header}
        <IconButton
          title={closeTitle || `Close ${typeof header === 'string' ? header : ''}`}
          color="inherit"
          onClick={deny}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      { !headerOnly && (
        <DialogContent
          ref={autofocusRef as React.MutableRefObject<HTMLDivElement>}
          sx={fullScreen ? {} : contentDimensions(contentWidth, contentHeight)}
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
            Cancel
          </Button>
        ) : null }
        { confirm ? (
          <Button
            disabled={canConfirm === false}
            color="primary"
            variant="contained"
            onClick={confirm}
          >
            Ok
          </Button>
        ) : null }
      </DialogActions>
    </Dialog>
  );
}

export default Lightbox;
