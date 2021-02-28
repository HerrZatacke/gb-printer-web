import React from 'react';
import PropTypes from 'prop-types';

const ExportSettings = (props) => (
  <div className="inputgroup buttongroup settings__export">
    <button
      type="button"
      className="button"
      onClick={() => props.exportJson('debug')}
    >
      Export debug settings
    </button>
    <button
      type="button"
      className="button"
      onClick={() => props.exportJson('settings')}
    >
      Export settings
    </button>
  </div>
);

ExportSettings.propTypes = {
  exportJson: PropTypes.func.isRequired,
};

ExportSettings.defaultProps = {};

export default ExportSettings;
