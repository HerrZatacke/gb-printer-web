import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

const PrinterReport = ({ printerData }) => (
  (printerData && printerData.fs && printerData.dumps) ? (
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
  ) : null
);

PrinterReport.propTypes = {
  printerData: PropTypes.object.isRequired,
};

export default PrinterReport;
