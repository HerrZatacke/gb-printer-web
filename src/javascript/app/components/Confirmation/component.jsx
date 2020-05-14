import React from 'react';
import PropTypes from 'prop-types';

const Confirmation = (props) => (
  props.message ? (
    <div className="confirmation">
      <div className="confirmation__backdrop" />
      <div className="confirmation__box">
        <div className="confirmation__message">
          {props.message}
        </div>
        <div className="confirmation__buttons">
          <button
            className="confirmation__button confirmation__button--confirm"
            type="button"
            onClick={props.confirm}
          >
            Ok
          </button>
          <button
            className="confirmation__button confirmation__button--deny"
            type="button"
            onClick={props.deny}
          >
            Nay
          </button>
        </div>
      </div>
    </div>
  ) : null
);

Confirmation.propTypes = {
  message: PropTypes.string,
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func.isRequired,
};

Confirmation.defaultProps = {
  message: null,
};

export default Confirmation;
