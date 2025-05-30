import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import useIframeLoaded from '@/hooks/useIframeLoaded';

const iframeSupported = (printerUrl?: string) => {
  if (!printerUrl) {
    return false;
  }

  if (printerUrl.startsWith('/')) {
    return true;
  }

  const { protocol: printerProtocol } = new URL(printerUrl);
  const { protocol: ownProtocol } = new URL(window.location.href);
  return ownProtocol === 'http:' || ownProtocol === printerProtocol;
};

// const iframeSupported = () => false;

function ConnectPrinter() {
  // Needs high timeout for slow responses of esp webserver
  const { printerUrl, failed, loaded, printerConnected } = useIframeLoaded(30000);

  return iframeSupported(printerUrl) && !failed ? (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <iframe
        style={{
          position: 'absolute',
          top: '80px',
          left: '-200vw',
          width: '480px',
          height: '90px',
        }}
        title="Transfer window"
        src={printerUrl}
      />
      {!loaded && <CircularProgress color="secondary" />}
    </Box>
  ) : (
    (!printerConnected || failed) && (
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => {
            window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
          }}
        >
          Open printer page
        </Button>
      </ButtonGroup>
    )
  );
}

export default ConnectPrinter;
