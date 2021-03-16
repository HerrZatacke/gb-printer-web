import React, { useEffect, useCallback, useState } from 'react';
import filesize from 'filesize';
import { getEnv } from '../../../tools/getEnv';

const targetWindow = window.opener || window.parent;
let heartBeatInterval;

const PrinterReport = () => {

  const [busy, setBusy] = useState(false);
  const [dumpCount, setDumpCount] = useState(0);
  const [printerData, setPrinterData] = useState({});

  const checkPrinter = useCallback(() => {
    setBusy(true);
    setPrinterData({});
    fetch('/dumps/list')
      .then((res) => res.json())
      .then((data) => {
        // the ArduinoJSON library strangely sometimes did not include all items in the list, so this is a basic check.
        if (data.fs.dumpcount !== data.dumps.length) {
          // eslint-disable-next-line no-alert
          alert('Inconststent image count received from printer.');
        }

        setPrinterData({
          ...data,
          dumps: [...data.dumps].sort(),
        });
        setDumpCount(data.fs.dumpcount);
        setBusy(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error.message);
        setBusy(false);
      });
  }, [setPrinterData, setBusy]);

  const fetchDumps = useCallback(() => {
    setBusy(true);
    const fnFetch = (remainingDumps) => {
      const nextDump = remainingDumps.shift();

      if (!nextDump) {
        setBusy(false);
        return;
      }

      fetch(`/${nextDump.replace(/^\//, '')}`)
        .then((res) => res.blob())
        .then((blob) => {

          targetWindow.postMessage({ remotePrinter: {
            blob,
          } }, '*');

          window.setTimeout(() => {
            fnFetch(remainingDumps);
          }, 200);
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error.message);
          setBusy(false);
        });
    };

    fnFetch([...printerData.dumps]);
  }, [printerData.dumps, setBusy]);

  const clearPrinter = useCallback(() => {
    setBusy(true);
    fetch('/dumps/clear')
      .then((res) => res.json())
      .then(({ deleted }) => {
        if (deleted !== undefined) {
          checkPrinter();
          setBusy(false);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error.message);
        setBusy(false);
      });
  }, [checkPrinter, setBusy]);

  useEffect(() => {
    heartBeatInterval = window.setInterval(() => {
      targetWindow.postMessage({ remotePrinter: { heartbeat: true } }, '*');
    }, 500);

    return () => window.clearInterval(heartBeatInterval);
  });

  const { env } = getEnv();

  return (
    (env === 'esp8266') ? (
      <>
        <div className="inputgroup buttongroup">
          <button
            type="button"
            className="button"
            disabled={busy}
            onClick={checkPrinter}
          >
            Check Printer
          </button>
          <button
            type="button"
            className="button"
            disabled={busy || dumpCount === 0}
            onClick={fetchDumps}
          >
            {`Download ${dumpCount || ''} Images`}
          </button>
          <button
            type="button"
            className="button"
            disabled={busy || dumpCount === 0}
            onClick={clearPrinter}
          >
            Clear Printer
          </button>
        </div>

        {printerData.fs && printerData.dumps ? (
          <div className="printer-report">
            <table className="printer-report__table">
              <thead>
                <tr>
                  <th className="printer-report__label printer-report__head">Printer Filesystem</th>
                  <th className="printer-report__value printer-report__head printer-report__value--url" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="printer-report__label">Total</td>
                  <td className="printer-report__value">{filesize(printerData.fs.total)}</td>
                </tr>
                <tr>
                  <td className="printer-report__label">Used</td>
                  <td className="printer-report__value">{filesize(printerData.fs.used)}</td>
                </tr>
                <tr>
                  <td className="printer-report__label">Free</td>
                  <td className="printer-report__value">
                    {`${Math.max(0, (printerData.fs.maximages - printerData.dumps.length))} images`}
                  </td>
                </tr>
                <tr>
                  <td className="printer-report__label">Images</td>
                  <td className="printer-report__value">{printerData.dumps.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </>
    ) : (
      <div className="inputgroup buttongroup">
        <button
          type="button"
          className="button"
          onClick={() => {
            import(/* webpackChunkName: "dmy" */ '../Import/dummy')
              .then(({ default: lines }) => {
                targetWindow.postMessage({ remotePrinter: {
                  lines,
                } }, '*');
              });
          }}
        >
          Test
        </button>
      </div>
    )
  );
};

export default PrinterReport;
