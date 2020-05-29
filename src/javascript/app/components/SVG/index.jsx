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
          <path d="M13 5v10h-1V5zM7 5v10H6V5zm4 0v10h-1V5zM9 5v10H8V5zM4 3v2h1v12h9V5h1V3h-4V2H8v1z" />
        </svg>
      );
    case 'edit':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M4 14.978v1.978L16 17v-2.022zM13.5 3l-8 8-1 3.5 3.5-1 8-8L13.5 3zm0 .8l.85.85-9.1 9.1L6 11.5l7.5-7.7z" />
        </svg>
      );
    case 'reset':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M6 10a4 4 0 104-4v2L4 5l6-3v2a6 6 0 11-6 6" />
        </svg>
      );
    case 'checkmark':
      return (
        <svg className="svg checked" viewBox="0 0 20 20">
          <path d="M15 5v10H5V5zM3 3v14h14V3z" />
          <path className="tick" d="M5.5 11l3 3 6-6.5L13 6l-4.5 5L7 9.5z" />
        </svg>
      );
    case 'circle':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <circle r="8" cx="10" cy="10" />
        </svg>
      );
    case 'save':
      return (
        <svg className="svg" viewBox="0 0 20 20">
          <path d="M12 4v3h-2V4zM5 15v-4h10v4zm8-7H6l.01-4H4v12h12V6l-2-2h-1z" />
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
    case 'close':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M7 3l12 17L7 37h2l11-15.584L31 37h2L21 20 33 3h-2L20 18.584 9 3H7z" />
        </svg>
      );
    case 'fullscreen':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M37 13h-2V9h-5V7h7zM3 13h2V9h5V7H3zm34 14h-2v4h-5v2h7zM3 27h2v4h5v2H3z" />
        </svg>
      );
    case 'right':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M17 3l12 17-12 17h-2l12-17L15 3z" />
        </svg>
      );
    case 'left':
      return (
        <svg className="svg" viewBox="0 0 40 40">
          <path d="M23 3L11 20l12 17h2L13 20 25 3z" />
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
