import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../Lightbox';

const InfoBox = ({ message, confirm }) => (
  message ? (
    <Lightbox
      className="info-box"
      confirm={() => confirm(message.type)}
      header={message.headline}
    >
      <div className="info-box__message">
        { message.text.map((text, index) => <p key={index}>{text}</p>) }
      </div>
    </Lightbox>
  ) : null
);

InfoBox.propTypes = {
  message: PropTypes.object,
  confirm: PropTypes.func.isRequired,
};

InfoBox.defaultProps = {
  message: null,
};

export default InfoBox;
