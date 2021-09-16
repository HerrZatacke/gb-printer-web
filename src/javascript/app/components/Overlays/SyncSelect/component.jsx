import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import SVG from '../../SVG';

const SyncSelect = ({ startSync, cancelSync, repoUrl, dropboxActive, gitActive }) => (
  <Lightbox
    className="sync-select"
    deny={cancelSync}
    header="Sync options"
  >
    <ul className="sync-select__list">
      <li className="sync-select__option">
        <button
          type="button"
          disabled={!gitActive}
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
          disabled={!gitActive}
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
      <li className="sync-select__option">
        <button
          type="button"
          disabled={!dropboxActive}
          className="sync-select__button button"
          title="Dropbox Difference"
          onClick={() => {
            startSync('dropbox', 'diff');
          }}
        >
          <span className="sync-select__button-label">
            Dropbox Difference
          </span>
          <SVG name="sync" className="svg--180" />
        </button>
      </li>
      <li className="sync-select__option">
        <button
          type="button"
          disabled={!dropboxActive}
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
        </button>
      </li>
      <li className="sync-select__option">
        <button
          type="button"
          disabled={!dropboxActive}
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
        </button>
      </li>

      <li className="sync-select__option">
        <button
          type="button"
          disabled={!dropboxActive}
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
    </ul>
  </Lightbox>
);

SyncSelect.propTypes = {
  startSync: PropTypes.func.isRequired,
  cancelSync: PropTypes.func.isRequired,
  repoUrl: PropTypes.string.isRequired,
  dropboxActive: PropTypes.bool.isRequired,
  gitActive: PropTypes.bool.isRequired,
};

SyncSelect.defaultProps = {};

export default SyncSelect;
