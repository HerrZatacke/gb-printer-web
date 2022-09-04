import React from 'react';
import PropTypes from 'prop-types';
import useStoragePersist from './useStoragePersist';

const ExportSettings = (props) => {

  const {
    persistAPIAvailable,
    persisted,
    requestPersist,
  } = useStoragePersist();
  return (
    <div className="inputgroup buttongroup settings__export">
      { persistAPIAvailable ? (
        <button
          type="button"
          className="button"
          disabled={persisted}
          onClick={requestPersist}
        >
          { persisted ? 'Storage is persistent' : 'Request storage persistence' }
        </button>
      ) : null }
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
};

ExportSettings.propTypes = {
  exportJson: PropTypes.func.isRequired,
};

ExportSettings.defaultProps = {};

export default ExportSettings;
