import React from 'react';
import PropTypes from 'prop-types';
import gifshot from 'gifshot';
import classnames from 'classnames';
import SVG from '../SVG';

const BATCH_ACTIONS = [
  'download',
  'delete',
  'edit',
];

if (gifshot.isSupported()) {
  BATCH_ACTIONS.push('animate');
}

const BatchButtons = (props) => (
  <ul className="batch-buttons gallery-button__group">
    <li
      className="gallery-button gallery-button--enabled"
    >
      <button
        type="button"
        onClick={props.filter}
      >
        <SVG name="filter" />
        { props.activeFilters === 0 ? null : (
          <span className="batch-buttons__bubble">{props.activeFilters}</span>
        )}
      </button>
    </li>
    <li
      className={
        classnames('gallery-button gallery-button--enabled', {
          'gallery-button--has-selected': !props.hasSelected,
        })
      }
    >
      <button
        type="button"
        onClick={() => props.batchTask(props.hasSelected ? 'uncheckall' : 'checkall', props.page)}
      >
        <SVG name="checkmark" />
        { props.selectedImages === 0 ? null : (
          <span className="batch-buttons__bubble">{props.selectedImages}</span>
        )}
      </button>
    </li>
    <li
      className="gallery-button gallery-button--enabled"
    >
      <button
        type="button"
        onClick={props.showSortOptions}
      >
        <SVG name="sort" />
      </button>
    </li>
    {
      BATCH_ACTIONS.map((action) => (
        <li
          key={action}
          className={
            classnames('gallery-button', {
              'gallery-button--disabled': !props.enabled,
              'gallery-button--enabled': props.enabled,
            })
          }
        >
          <button
            disabled={!props.enabled}
            type="button"
            onClick={() => props.batchTask(action, props.page)}
          >
            <SVG name={action} />
          </button>
        </li>
      ))
    }
  </ul>
);

BatchButtons.propTypes = {
  batchTask: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  activeFilters: PropTypes.number.isRequired,
  selectedImages: PropTypes.number.isRequired,
  filter: PropTypes.func.isRequired,
  showSortOptions: PropTypes.func.isRequired,
  hasSelected: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
