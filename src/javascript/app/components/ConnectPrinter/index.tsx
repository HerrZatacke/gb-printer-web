import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import classnames from 'classnames';
import PrinterReport from '../PrinterReport';
import useIframeLoaded from '../../../hooks/useIframeLoaded';
import './index.scss';

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
  const { printerUrl, failed, loaded, printerConnected } = useIframeLoaded(5000);

  return (
    <div className="connect-printer">
      <PrinterReport />
      {
        iframeSupported(printerUrl) && !failed ? (
          <>
            <iframe
              className={classnames('connect-printer__remote-printer-iframe', {
                'connect-printer__remote-printer-iframe--connected': printerConnected,
              })}
              title="Transfer window"
              src={printerUrl}
            />
            {!loaded && <div className="connect-printer__iframe-loading" />}
          </>
        ) : (
          (!printerConnected || failed) && (
            <ButtonGroup fullWidth>
              <Button
                onClick={() => {
                  window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
                }}
                variant="contained"
              >
                Open printer page
              </Button>
            </ButtonGroup>
          )
        )
      }
    </div>
  );
}

export default ConnectPrinter;
