import React from 'react';
import classnames from 'classnames';
import './infoText.scss';

export enum InfoTextTheme {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

interface Props {
  label: string,
  themes: InfoTextTheme[],
}

function InfoText({
  label,
  themes,
}: Props) {
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

export default InfoText;
