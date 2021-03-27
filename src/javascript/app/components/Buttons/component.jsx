/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import PropTypes from 'prop-types';

const Buttons = ({ confirm, deny, canConfirm, focusConfirm }) => (
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
        disabled={!canConfirm}
        className="buttons__button buttons__button--confirm"
        type="button"
        onClick={confirm}
        autoFocus={focusConfirm}
      >
        Ok
      </button>
    ) : null }
  </div>
);

Buttons.propTypes = {
  confirm: PropTypes.func,
  focusConfirm: PropTypes.bool,
  canConfirm: PropTypes.bool,
  deny: PropTypes.func,
};

Buttons.defaultProps = {
  confirm: null,
  focusConfirm: true,
  canConfirm: true,
  deny: null,
};

export default Buttons;
