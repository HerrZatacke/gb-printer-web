import React from 'react';
import PropTypes from 'prop-types';

const Buttons = (props) => (
  <div className="buttons">
    <button
      className="buttons__button buttons__button--deny"
      type="button"
      onClick={props.deny}
    >
      Cancel
    </button>
    <button
      className="buttons__button buttons__button--confirm"
      type="button"
      onClick={props.confirm}
    >
      Ok
    </button>
  </div>
);

Buttons.propTypes = {
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func.isRequired,
};

Buttons.defaultProps = {
};

export default Buttons;
