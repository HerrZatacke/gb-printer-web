import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

const PrinterReport = (props) => (
  props.printerData.fs && props.printerData.dumps ? (
    <div className="printer-report">
      <table className="printer-report__table">
        <thead>
          <tr>
            <th />
            <th>Printer Filesystem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="printer-report__label">Total</td>
            <td className="printer-report__value">{filesize(props.printerData.fs.total)}</td>
          </tr>
          <tr>
            <td className="printer-report__label">Used</td>
            <td className="printer-report__value">{filesize(props.printerData.fs.used)}</td>
          </tr>
          <tr>
            <td className="printer-report__label">Free</td>
            <td className="printer-report__value">{`${filesize(props.printerData.fs.available)} (~${Math.floor(props.printerData.fs.available / 5768)} dumps)`}</td>
          </tr>
          <tr>
            <td className="printer-report__label">Dumps</td>
            <td className="printer-report__value">{props.printerData.dumps.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null
);

PrinterReport.propTypes = {
  printerData: PropTypes.shape({
    fs: PropTypes.shape({
      total: PropTypes.number,
      used: PropTypes.number,
      available: PropTypes.number,
      dumpcount: PropTypes.number,
    }),
    dumps: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

PrinterReport.defaultProps = {};

export default PrinterReport;
