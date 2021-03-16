import React, { useState } from 'react';
import filesize from 'filesize';
import { getEnv } from '../../../tools/getEnv';
import useTheme from '../../../hooks/useTheme';
import useCheckPrinter from '../../../hooks/useCheckPrinter';
import useFetchDumps from '../../../hooks/useFetchDumps';
import useClearPrinter from '../../../hooks/useClearPrinter';
import useHeartbeat from '../../../hooks/useHeartbeat';

const targetWindow = window.opener || window.parent;

const PrinterReport = () => {

  const [busy, setBusy] = useState(false);
  const [dumpCount, setDumpCount] = useState(0);
  const [printerData, setPrinterData] = useState({});

  const checkPrinter = useCheckPrinter(setBusy, setPrinterData, setDumpCount);
  const fetchDumps = useFetchDumps(setBusy, printerData.dumps, targetWindow);
  const clearPrinter = useClearPrinter(setBusy, checkPrinter);

  useTheme();
  useHeartbeat(targetWindow);


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
