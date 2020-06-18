import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

const PrinterReport = (props) => (
  props.printerData.fs && props.printerData.dumps ? (
    <div className="printer-report">
      <table className="printer-report__table">
        <thead>
          <tr>
            <th className="printer-report__label printer-report__head">Printer Filesystem</th>
            <th className="printer-report__value printer-report__head printer-report__value--url">{props.printerUrl}</th>
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
            <td className="printer-report__value">{`${Math.max(0, (props.printerData.fs.maximages - props.printerData.dumps.length))} images`}</td>
          </tr>
          <tr>
            <td className="printer-report__label">Images</td>
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
      dumpcount: PropTypes.number,
      maximages: PropTypes.number,
      total: PropTypes.number,
      used: PropTypes.number,
    }),
    dumps: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  printerUrl: PropTypes.string.isRequired,
};

PrinterReport.defaultProps = {};

export default PrinterReport;
