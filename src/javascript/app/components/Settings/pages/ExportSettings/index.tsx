import React from 'react';
import { useDispatch } from 'react-redux';
import useStoragePersist from './useStoragePersist';
import useHashCleanup from '../../../../../tools/hashCleanup';
import { Actions } from '../../../../store/actions';
import { ExportJSONAction, ExportTypes } from '../../../../store/defaults';

const ExportSettings = () => {
  const dispatch = useDispatch();
  const { hashCleanup, cleanupBusy } = useHashCleanup();

  const exportJson = (what: ExportTypes) => {
    dispatch<ExportJSONAction>({
      type: Actions.JSON_EXPORT,
      payload: what,
    });
  };

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
        onClick={() => exportJson(ExportTypes.DEBUG)}
      >
        Export debug settings
      </button>
      <button
        type="button"
        className="button"
        onClick={() => exportJson(ExportTypes.SETTINGS)}
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

export default ExportSettings;
