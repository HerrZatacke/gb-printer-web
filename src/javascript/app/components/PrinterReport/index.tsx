import React from 'react';
import filesize from 'filesize';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { usePrinter } from './usePrinter';
import { PrinterFunction } from '../../../consts/printerFunction';

import './index.scss';

const functionLabels: Record<PrinterFunction, string> = {
  testFile: 'Print test image',
  checkPrinter: 'Check Printer',
  fetchImages: '',
  clearPrinter: 'Clear Printer',
  tear: 'Tear',
};

const getFetchImagesLabel = (printerFunctions: PrinterFunction[], dumpsLength: number): string => {
  if (printerFunctions.includes(PrinterFunction.TEAR) || !dumpsLength) {
    return 'Fetch images';
  }

  return `Fetch ${dumpsLength || 0} images`;
};

function PrinterReport() {
  const {
    printerData,
    printerFunctions,
    printerConnected,
    callRemoteFunction,
    printerBusy,
  } = usePrinter();

  if (!printerConnected) {
    return null;
  }

  return (
    <div className="printer-report">
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        {printerFunctions.map((name) => (
          <Button
            key={name}
            disabled={
              printerBusy ||
              (
                [PrinterFunction.FETCHIMAGES, PrinterFunction.CLEARPRINTER, PrinterFunction.TEAR].includes(name) &&
                !printerData?.dumps?.length
              )
            }
            onClick={() => callRemoteFunction(name)}
          >
            {
              name === PrinterFunction.FETCHIMAGES ?
                getFetchImagesLabel(printerFunctions, printerData?.dumps?.length || 0) :
                functionLabels[name as PrinterFunction]
            }
          </Button>
        ))}
      </ButtonGroup>

      {
        (printerData?.fs && printerData?.dumps) ? (
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
                <td className="printer-report__value">{filesize(printerData?.fs.total)}</td>
              </tr>
              <tr>
                <td className="printer-report__label">Used</td>
                <td className="printer-report__value">{filesize(printerData?.fs.used)}</td>
              </tr>
              <tr>
                <td className="printer-report__label">Free</td>
                <td className="printer-report__value">
                  {`${Math.max(0, ((printerData?.fs.maximages || 0) - (printerData?.dumps.length || 0)))} images`}
                </td>
              </tr>
              <tr>
                <td className="printer-report__label">Images</td>
                <td className="printer-report__value">{printerData?.dumps.length}</td>
              </tr>
            </tbody>
          </table>
        ) : null
      }
      {
        (printerData?.message) ? (
          <p className="printer-report__message">
            { printerData?.message }
          </p>
        ) : null
      }
    </div>
  );
}

export default PrinterReport;
