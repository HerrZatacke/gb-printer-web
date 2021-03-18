import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import PrinterReport from '../PrinterReport';
import useIframeLoaded from '../../../hooks/useIframeLoaded';

const iframeSupported = (printerUrl) => {
  if (printerUrl.startsWith('/')) {
    return true;
  }

  const { protocol: printerProtocol } = new URL(printerUrl);
  const { protocol: ownProtocol } = new URL(window.location.href);
  return ownProtocol === 'http:' || ownProtocol === printerProtocol;
};

// const iframeSupported = () => false;

const ConnectPrinter = ({ printerUrl, printerConnected }) => {

  const [failed, loaded, setLoaded] = useIframeLoaded(5000);

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
              onLoad={setLoaded}
            />
            {!loaded && <div className="connect-printer__iframe-loading" />}
          </>
        ) : (
          (!printerConnected || failed) && (
            <div className="inputgroup buttongroup">
              <button
                type="button"
                className="button"
                onClick={() => {
                  window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
                }}
              >
                Open printer page
              </button>
            </div>
          )
        )
      }
    </div>
  );
};

ConnectPrinter.propTypes = {
  printerUrl: PropTypes.string.isRequired,
  printerConnected: PropTypes.bool.isRequired,
};

export default ConnectPrinter;
