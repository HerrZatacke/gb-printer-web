import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const SVG = (props) => {
  switch (props.name) {
    case 'download':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M8 3v7H5s5 6 5 6c0 0 5-6 5-6h-3V3z" />
          <path d="M5 15v2l10 0V15z" />
        </svg>
      );
    case 'delete':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M6 5L5 6l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4z" />
        </svg>
      );
    case 'edit':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M4 14.978v1.978L16 17v-2.022zM13.5 3l-8 8-1 3.5 3.5-1 8-8L13.5 3zm0 .8l.85.85-9.1 9.1L6 11.5l7.5-7.7z" />
        </svg>
      );
    case 'circle':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <circle r="8" cx="10" cy="10" />
        </svg>
      );
    case 'list':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M6 6v4h28V6zm0 8v4h28v-4zm0 8v4h28v-4zm0 8v4h28V30z" />
        </svg>
      );
    case '1x':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M5 5v6h6V5zm8 0v6h6V5zm8 0v6h6V5zm8 0v6h6V5zM5 13v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zM5 21v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zM5 29v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6z" />
        </svg>
      );
    case '2x':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M22 6v12h12V6zm0 16v12h12V22zM6 6v12h12V6zm0 16v12h12V22z" />
        </svg>
      );
    case '3x':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M30 30V10H10v20" />
        </svg>
      );
    case '4x':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M34 34V6H6v28z" />
        </svg>
      );
    default:
      return null;
  }
};

SVG.propTypes = {
  name: PropTypes.string.isRequired,
};

SVG.defaultProps = {};

export default SVG;
