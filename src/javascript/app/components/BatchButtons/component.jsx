import React from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';

const BATCH_ACTIONS = [
  'download',
  'delete',
  'edit',
];

const BatchButtons = (props) => (
  <ul className="batch-buttons">
    {
      BATCH_ACTIONS.map((action) => (
        <li
          key={action}
          className="batch-buttons__action"
        >
          <button
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
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
