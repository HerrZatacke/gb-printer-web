import React from 'react';
import PropTypes from 'prop-types';
import Buttons from '../Buttons';

const Confirmation = (props) => (
  props.message ? (
    <div className="confirmation">
      <button
        type="button"
        className="confirmation__backdrop"
        onClick={props.deny}
      />
      <div className="confirmation__box">
        <div className="confirmation__message">
          {props.message}
        </div>
        <Buttons confirm={props.confirm} deny={props.deny} />
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
