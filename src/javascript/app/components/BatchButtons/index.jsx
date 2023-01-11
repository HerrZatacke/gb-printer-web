import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import PluginSelect from '../PluginSelect';
import './index.scss';
import useBatchButtons from './useBatchButtons';

const BATCH_ACTIONS = [
  'download',
  'delete',
  'edit',
];

// if (gifshot.isSupported()) {
BATCH_ACTIONS.push('animate');
// }

const BatchButtons = ({ page }) => {

  const {
    hasPlugins,
    batchEnabled,
    activeFilters,
    selectedImages,
    hasSelected,
    batchTask,
    filter,
    showSortOptions,
  } = useBatchButtons(page);

  return (
    <ul className="batch-buttons gallery-button__group">
      <li
        className="gallery-button gallery-button--enabled"
      >
        <button
          type="button"
          onClick={showSortOptions}
        >
          <SVG name="sort" />
        </button>
      </li>
      <li
        className="gallery-button gallery-button--enabled"
      >
        <button
          type="button"
          onClick={filter}
        >
          <SVG name="filter" />
          {activeFilters === 0 ? null : (
            <span className="batch-buttons__bubble">{activeFilters}</span>
          )}
        </button>
      </li>
      <li
        className={
          classnames('gallery-button gallery-button--enabled', {
            'gallery-button--has-selected': !hasSelected,
          })
        }
      >
        <button
          type="button"
          onClick={() => batchTask(hasSelected ? 'uncheckall' : 'checkall')}
        >
          <SVG name="checkmark" />
          {selectedImages === 0 ? null : (
            <span className="batch-buttons__bubble">{selectedImages}</span>
          )}
        </button>
      </li>
      {
        BATCH_ACTIONS.map((action) => (
          <li
            key={action}
            className={
              classnames('gallery-button', {
                'gallery-button--disabled': !batchEnabled,
                'gallery-button--enabled': batchEnabled,
              })
            }
          >
            <button
              disabled={!batchEnabled}
              type="button"
              onClick={() => batchTask(action)}
            >
              <SVG name={action} />
            </button>
          </li>
        ))
      }
      {hasPlugins ? (
        <li
          className={
            classnames('gallery-button', {
              'gallery-button--disabled': !batchEnabled,
              'gallery-button--enabled': batchEnabled,
            })
          }
        >
          <PluginSelect>
            <button
              type="button"
            >
              <SVG name="plug" />
            </button>
          </PluginSelect>
        </li>
      ) : null}
    </ul>
  );
};

BatchButtons.propTypes = {
  page: PropTypes.number.isRequired,
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
