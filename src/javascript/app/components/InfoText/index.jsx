import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';

function InfoText({
  label,
  themes,
}) {
  return (
    <p
      className={
        classnames(
          'info-text',
          themes.map((name) => `info-text--${name}`),
        )
      }
    >
      {label}
    </p>
  );
}

InfoText.propTypes = {
  label: PropTypes.string.isRequired,
  themes: PropTypes.array.isRequired,
};

export default InfoText;
