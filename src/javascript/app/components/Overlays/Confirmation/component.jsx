import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';

const Confirmation = (props) => (
  props.message ? (
    <Lightbox
      className="confirmation"
      confirm={props.confirm}
      deny={props.deny}
      header={props.message}
    />
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
