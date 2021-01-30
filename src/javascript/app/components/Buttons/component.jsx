/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import PropTypes from 'prop-types';

const Buttons = ({ confirm, deny }) => (
  <div className="buttons">
    { deny ? (
      <button
        className="buttons__button buttons__button--deny"
        type="button"
        onClick={deny}
      >
        Cancel
      </button>
    ) : null }
    { confirm ? (
      <button
        className="buttons__button buttons__button--confirm"
        type="button"
        onClick={confirm}
        autoFocus
      >
        Ok
      </button>
    ) : null }
  </div>
);

Buttons.propTypes = {
  confirm: PropTypes.func,
  deny: PropTypes.func,
};

Buttons.defaultProps = {
  confirm: null,
  deny: null,
};

export default Buttons;
