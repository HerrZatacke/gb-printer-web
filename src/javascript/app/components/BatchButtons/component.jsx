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
    {
      BATCH_ACTIONS.map((action) => (
        <li
          key={action}
          className={
            classnames('batch-buttons__action', {
              'batch-buttons__action--disabled': !props.enabled,
            })
          }
        >
          <button
            disabled={!props.enabled}
            type="button"
            onClick={() => props.batchDelete(action)}
          >
            <SVG name={action} />
          </button>
        </li>
      ))
    }
  </ul>
);

BatchButtons.propTypes = {
  batchDelete: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
