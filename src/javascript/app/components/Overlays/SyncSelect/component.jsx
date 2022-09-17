import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import SVG from '../../SVG';

const SyncSelect = ({
  startSync,
  cancelSync,
  repoUrl,
  dropboxActive,
  gitActive,
  syncLastUpdate,
  autoDropboxSync,
}) => {

  const showSyncHints = autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox);

  return (
    <Lightbox
      className="sync-select"
      deny={cancelSync}
      header="Synchronize"
    >
      <ul className="sync-select__list">
        {gitActive && (
          <>
            <li className="sync-select__option">
              <button
                type="button"
                className="sync-select__button button"
                title={`Synchronize to GitHub\n${repoUrl}`}
                onClick={() => {
                  startSync('git', 'up');
                }}
              >
                <span className="sync-select__button-label">
                  Synchronize to GitHub
                </span>
                <SVG name="sync" className="svg--180" />
              </button>
            </li>
            <li className="sync-select__option">
              <button
                type="button"
                className="sync-select__button button"
                title={`Synchronize from GitHub\n${repoUrl}`}
                onClick={() => {
                  startSync('git', 'down');
                }}
              >
                <span className="sync-select__button-label">
                  Synchronize from GitHub
                </span>
                <SVG name="sync" />
              </button>
            </li>
          </>
        )}
        {dropboxActive && (
          <>
            <li className="sync-select__option">
              <button
                type="button"
                className="sync-select__button button"
                title="Synchronize to Dropbox"
                onClick={() => {
                  startSync('dropbox', 'up');
                }}
              >
                <span className="sync-select__button-label">
                  Synchronize to Dropbox
                </span>
                <SVG name="sync" className="svg--180" />
                {showSyncHints && (
                  <span
                    className={classnames('sync-select__button-hint', {
                      'sync-select__button-hint--warn': syncLastUpdate.local < syncLastUpdate.dropbox,
                    })}
                  >
                    {
                      syncLastUpdate.local < syncLastUpdate.dropbox ?
                        'There are pending remote changes. If you synchronize to dropbox now, these will be lost.' :
                        'Upload changes to dropbox'
                    }
                  </span>
                )}
              </button>
            </li>
            <li className="sync-select__option">
              <button
                type="button"
                className="sync-select__button button"
                title="Synchronize from Dropbox"
                onClick={() => {
                  startSync('dropbox', 'down');
                }}
              >
                <span className="sync-select__button-label">
                  Synchronize from Dropbox
                </span>
                <SVG name="sync" />
                {showSyncHints && (
                  <span
                    className={classnames('sync-select__button-hint', {
                      'sync-select__button-hint--warn': syncLastUpdate.local > syncLastUpdate.dropbox,
                    })}
                  >
                    {
                      syncLastUpdate.local > syncLastUpdate.dropbox ?
                        'There are local changes not synched to dropbox yet. If you synchronize from dropbox now, these will be lost.' :
                        'Download changes from dropbox'
                    }
                  </span>
                )}
              </button>
            </li>
            <li className="sync-select__option">
              <button
                type="button"
                className="sync-select__button button"
                title="Synchronize images to Dropbox"
                onClick={() => {
                  startSync('dropboximages', 'up');
                }}
              >
                <span className="sync-select__button-label">
                  Synchronize images to Dropbox
                </span>
                <SVG name="sync" className="svg--180" />
              </button>
            </li>
          </>
        )}
      </ul>
    </Lightbox>
  );
};

SyncSelect.propTypes = {
  startSync: PropTypes.func.isRequired,
  cancelSync: PropTypes.func.isRequired,
  repoUrl: PropTypes.string.isRequired,
  dropboxActive: PropTypes.bool.isRequired,
  autoDropboxSync: PropTypes.bool.isRequired,
  gitActive: PropTypes.bool.isRequired,
  syncLastUpdate: PropTypes.shape({
    dropbox: PropTypes.number.isRequired,
    local: PropTypes.number.isRequired,
  }).isRequired,
};

SyncSelect.defaultProps = {};

export default SyncSelect;
