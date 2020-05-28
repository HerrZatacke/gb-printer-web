import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const BATCH_ACTIONS = [
  // 'download',
  'delete',
  // 'edit',
];

const BatchButtons = (props) => (
  <ul className="batch-buttons">
    <li
      className={
        classnames('batch-buttons__action batch-buttons__action--enabled', {
          'batch-buttons__action--has-unselected': props.hasUnselected,
        })
      }
    >
      <button
        type="button"
        onClick={() => props.batchTask(props.hasUnselected ? 'checkall' : 'uncheckall')}
      >
        <SVG name="checkmark" />
      </button>
    </li>
    {
      BATCH_ACTIONS.map((action) => (
        <li
          key={action}
          className={
            classnames('batch-buttons__action', {
              'batch-buttons__action--disabled': !props.enabled,
              'batch-buttons__action--enabled': props.enabled,
            })
          }
        >
          <button
            disabled={!props.enabled}
            type="button"
            onClick={() => props.batchTask(action)}
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
  hasUnselected: PropTypes.bool.isRequired,
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
