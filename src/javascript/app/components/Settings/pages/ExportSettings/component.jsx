import React from 'react';
import PropTypes from 'prop-types';
import useStoragePersist from './useStoragePersist';
import useHashCleanup from '../../../../../tools/hashCleanup';

const ExportSettings = (props) => {
  const { hashCleanup, cleanupBusy } = useHashCleanup();

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
      <button
        disabled={cleanupBusy}
        type="button"
        className="button button--tiny"
        onClick={hashCleanup}
      >
        Hash Cleanup
      </button>
    </div>
  );
};

ExportSettings.propTypes = {
  exportJson: PropTypes.func.isRequired,
};

ExportSettings.defaultProps = {};

export default ExportSettings;
