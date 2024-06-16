import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

const SVG = (props) => {

  const className = classNames('svg', `svg--${props.name}`, props.className);

  switch (props.name) {
    case 'download':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M8 3v7H5s5 6 5 6c0 0 5-6 5-6h-3V3z" />
          <path d="M5 15v2l10 0V15z" />
        </svg>
      );
    case 'clone':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M3 2v13h3v3h10V5h-3V2zm1 1h8v2H8.11l.78 1H15v11H7V9.639L6 8.36V14H4zm2.162.996L4.588 5.23l4.314 5.51-1.574 1.233 6.063 2.875-1.338-6.575-1.574 1.235z" />
        </svg>
      );
    case 'delete':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M13 5v10h-1V5zM7 5v10H6V5zm4 0v10h-1V5zM9 5v10H8V5zM4 3v2h1v12h9V5h1V3h-4V2H8v1z" />
        </svg>
      );
    case 'loading':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M10 2 4 5l6 3V6c3.15 0 4.911 3.369 3.535 5.89l1.8.881C17.337 8.996 14.7 4 10 4zm-.001 16 6-3-6-3v2c-3.15 0-4.911-3.369-3.535-5.89l-1.8-.881C2.662 11.004 5.299 16 9.999 16z" />
        </svg>
      );
    case 'warn':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M10.75 16v-1.5h-1.5V16zm0-3V6h-1.5v7zM2 17c.192-.312 8-14 8-14l8 14z" />
        </svg>
      );
    case 'arrowdown':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="m3 5 7 10 7-10z" />
        </svg>
      );
    case 'plug':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M12.526 9.533c0-1.932-1.856-3.033-4.21-3.033H6.21v.778H2v.972h4.21v3.5H2.02l-.02.972h4.21v.778h2.106c2.354 0 4.21-1.1 4.21-3.033 2.31-.651 3.02.774 5.474 0v-.934c-2.27.808-2.999-.697-5.474 0z" />
        </svg>
      );
    case 'share':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M14 3.5A2.5 2.5 0 0011.5 6a2.5 2.5 0 00.025.336l-3.85 1.812A2.5 2.5 0 006 7.5 2.5 2.5 0 003.5 10 2.5 2.5 0 006 12.5a2.5 2.5 0 001.676-.648l3.85 1.812A2.5 2.5 0 0011.5 14a2.5 2.5 0 002.5 2.5 2.5 2.5 0 002.5-2.5 2.5 2.5 0 00-2.5-2.5 2.5 2.5 0 00-1.836.807l-3.728-1.754A2.5 2.5 0 008.5 10a2.5 2.5 0 00-.066-.553l3.73-1.754A2.5 2.5 0 0014 8.5 2.5 2.5 0 0016.5 6 2.5 2.5 0 0014 3.5z" />
        </svg>
      );
    case 'sync':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M8 8.5v5H5s4.866 6 5 6c.134 0 5-6 5-6h-3v-5zm2-8l-6 3 6 3v-2c3.15 0 4.911 3.369 3.535 5.89l1.8.881C17.337 7.496 14.7 2.5 10 2.5zM4.664 5.729C3.271 8.357 4.2 11.392 6 13h1.5v-1.4c-1.358-.983-2.02-3.185-1.035-4.99z" />
        </svg>
      );
    case 'edit':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M4 14.978v1.978L16 17v-2.022zM13.5 3l-8 8-1 3.5 3.5-1 8-8L13.5 3zm0 .8l.85.85-9.1 9.1L6 11.5l7.5-7.7z" />
        </svg>
      );
    case 'view':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M5.506 6.6L1 10l4.504 3.4c1.199.88 2.814 1.372 4.496 1.371 1.682 0 3.296-.492 4.494-1.37L19 10l-4.504-3.4C13.297 5.72 11.711 5.228 10 5.237c-1.711.009-3.318.5-4.494 1.363zm4.152-.502c2.101 0 3.805 1.747 3.805 3.902 0 2.155-1.704 3.902-3.805 3.902-2.1 0-3.804-1.747-3.804-3.902 0-2.155 1.703-3.902 3.804-3.902zm-.894 2.035c-1.006 0-1.821.836-1.82 1.867-.001 1.031.814 1.868 1.82 1.867 1.004 0 1.818-.836 1.818-1.867 0-1.03-.814-1.867-1.818-1.867z" />
        </svg>
      );
    case 'fav':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="m13 6.1c1.8 0 1.9 2.1 1.9 2.1 0 1.8-1.5 3.6-4.9 5.7-3.4-2.1-4.9-3.9-4.9-5.7 0 0 0.1-2.1 1.9-2.1 0.3 0 1 0.1 1.8 0.6l1.2 0.9 1.2-0.9c0.7-0.5 1.5-0.6 1.8-0.6m0-2c-0.4 0-1.7 0-3 1-1.3-1-2.6-1-3-1-2.8 0-3.9 2.7-3.9 4.1 0 3.1 2.6 5.6 6.9 8 4.2-2.4 6.9-4.9 6.9-8 0-1.4-1.1-4.1-3.9-4.1z" />
        </svg>
      );
    case 'animate':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M3 4v12h14V4zm.5.5h2v2h-2zm2.75 0h2v2h-2zM9 4.5h2v2H9zm2.75 0h2v2h-2zm2.75 0h2v2h-2zM4 7h12v6H4zm-.5 6.5h2v2h-2zm2.75 0h2v2h-2zm2.75 0h2v2H9zm2.75 0h2v2h-2zm2.75 0h2v2h-2z" />
        </svg>
      );
    case 'reset':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M6 10a4 4 0 104-4v2L4 5l6-3v2a6 6 0 11-6 6" />
        </svg>
      );
    case 'checkmark':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M15 5v10H5V5zM3 3v14h14V3z" />
          <path className="tick" d="M5.5 11l3 3 6-6.5L13 6l-4.5 5L7 9.5z" />
        </svg>
      );
    case 'circle':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <circle r="8" cx="10" cy="10" />
        </svg>
      );
    case 'add':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2z" />
        </svg>
      );
    case 'file-add':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M9 6.5v3.52l-3.5-.04v2l3.5.04v3.48h2v-3.48h3.5v-2H11V6.5ZM1 17V3h6l2 2h10v12z" />
        </svg>
      );
    case 'remove':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M2 8v4h16V8z" />
        </svg>
      );
    case 'save':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M12 4v3h-2V4zM5 15v-4h10v4zm8-7H6l.01-4H4v12h12V6l-2-2h-1z" />
        </svg>
      );
    case 'sort':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path d="M4.5 8.5L10 3l5.5 5.5zm0 3L10 17l5.5-5.5z" />
        </svg>
      );
    case 'list':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M6 6v4h28V6zm0 8v4h28v-4zm0 8v4h28v-4zm0 8v4h28V30z" />
        </svg>
      );
    case '1x':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M5 5v6h6V5zm8 0v6h6V5zm8 0v6h6V5zm8 0v6h6V5zM5 13v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zM5 21v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zM5 29v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6zm8 0v6h6v-6z" />
        </svg>
      );
    case '2x':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M22 6v12h12V6zm0 16v12h12V22zM6 6v12h12V6zm0 16v12h12V22z" />
        </svg>
      );
    case '3x':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M30 30V10H10v20" />
        </svg>
      );
    case '4x':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M34 34V6H6v28z" />
        </svg>
      );
    case 'close':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M7 3l12 17L7 37h2l11-15.584L31 37h2L21 20 33 3h-2L20 18.584 9 3H7z" />
        </svg>
      );
    case 'fullscreen':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M37 13h-2V9h-5V7h7zM3 13h2V9h5V7H3zm34 14h-2v4h-5v2h7zM3 27h2v4h5v2H3z" />
        </svg>
      );
    case 'right':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M17 3l12 17-12 17h-2l12-17L15 3z" />
        </svg>
      );
    case 'left':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M23 3L11 20l12 17h2L13 20 25 3z" />
        </svg>
      );
    case 'burger':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M2 6v4h36V6zm0 12v4h36v-4zm0 12v4h36v-4z" />
        </svg>
      );
    case 'close-nav':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M5.5 2.5l-3 3L17 20 2.5 34.5l3 3L20 23l14.5 14.5 3-3L23 20 37.5 5.5l-3-3L20 17z" />
        </svg>
      );
    case 'filter':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M34 10V6H6v4l12 12v12h4V22z" />
        </svg>
      );
    case 'moon':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M15.715 35.424a16.016 16 0 004.273.576A16.016 16 0 0036 20.004 16.016 16 0 0019.988 4a16.016 16 0 00-4.27.585 16.016 16 0 01.303.084 16.016 16 0 01.331.105 16.016 16 0 01.331.109 16.016 16 0 01.327.12 16.016 16 0 01.323.122 16.016 16 0 01.322.129 16.016 16 0 01.323.14 16.016 16 0 01.315.146 16.016 16 0 01.315.15 16.016 16 0 01.307.16 16.016 16 0 01.306.166 16.016 16 0 01.299.169 16.016 16 0 01.298.181 16.016 16 0 01.299.186 16.016 16 0 01.29.19 16.016 16 0 01.283.197 16.016 16 0 01.283.201 16.016 16 0 01.278.214 16.016 16 0 01.274.214 16.016 16 0 01.267.221 16.016 16 0 01.262.23 16.016 16 0 01.258.23 16.016 16 0 01.25.242 16.016 16 0 01.25.242 16.016 16 0 01.243.25 16.016 16 0 01.238.254 16.016 16 0 01.23.258 16.016 16 0 01.226.266 16.016 16 0 01.218.266 16.016 16 0 01.214.278 16.016 16 0 01.21.278 16.016 16 0 01.201.282 16.016 16 0 01.194.282 16.016 16 0 01.19.295 16.016 16 0 01.181.298 16.016 16 0 01.178.298 16.016 16 0 01.17.303 16.016 16 0 01.16.306 16.016 16 0 01.162.31 16.016 16 0 01.145.315 16.016 16 0 01.146.318 16.016 16 0 01.137.319 16.016 16 0 01.129.322 16.016 16 0 01.12.323 16.016 16 0 01.114.33 16.016 16 0 01.109.33 16.016 16 0 01.1.331 16.016 16 0 01.094.34 16.016 16 0 01.084.334 16.016 16 0 01.081.338 16.016 16 0 01.069.339 16.016 16 0 01.064.343 16.016 16 0 01.057.342 16.016 16 0 01.048.343 16.016 16 0 01.04.347 16.016 16 0 01.037.346 16.016 16 0 01.024.343 16.016 16 0 01.02.35 16.016 16 0 01.012.343 16.016 16 0 010 .351 16.016 16 0 010 .121 16.016 16 0 010 .347 16.016 16 0 01-.016.346 16.016 16 0 01-.024.347 16.016 16 0 01-.028.347 16.016 16 0 01-.04.346 16.016 16 0 01-.041.343 16.016 16 0 01-.053.343 16.016 16 0 01-.056.342 16.016 16 0 01-.069.343 16.016 16 0 01-.072.339 16.016 16 0 01-.08.338 16.016 16 0 01-.09.335 16.016 16 0 01-.097.334 16.016 16 0 01-.1.331 16.016 16 0 01-.11.33 16.016 16 0 01-.12.323 16.016 16 0 01-.122.33 16.016 16 0 01-.133.323 16.016 16 0 01-.137.315 16.016 16 0 01-.145.318 16.016 16 0 01-.154.31 16.016 16 0 01-.16.31 16.016 16 0 01-.162.307 16.016 16 0 01-.174.299 16.016 16 0 01-.177.298 16.016 16 0 01-.186.294 16.016 16 0 01-.19.29 16.016 16 0 01-.201.287 16.016 16 0 01-.202.282 16.016 16 0 01-.21.274 16.016 16 0 01-.214.274 16.016 16 0 01-.226.266 16.016 16 0 01-.226.262 16.016 16 0 01-.23.262 16.016 16 0 01-.242.25 16.016 16 0 01-.242.25 16.016 16 0 01-.25.242 16.016 16 0 01-.255.234 16.016 16 0 01-.258.234 16.016 16 0 01-.266.225 16.016 16 0 01-.27.218 16.016 16 0 01-.275.214 16.016 16 0 01-.282.205 16.016 16 0 01-.279.202 16.016 16 0 01-.286.197 16.016 16 0 01-.295.186 16.016 16 0 01-.294.185 16.016 16 0 01-.3.178 16.016 16 0 01-.302.169 16.016 16 0 01-.306.161 16.016 16 0 01-.311.157 16.016 16 0 01-.315.15 16.016 16 0 01-.319.145 16.016 16 0 01-.318.133 16.016 16 0 01-.323.129 16.016 16 0 01-.323.12 16.016 16 0 01-.331.117 16.016 16 0 01-.33.11 16.016 16 0 01-.336.096 16.016 16 0 01-.19.057z" />
        </svg>
      );
    case 'usb':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M20 3a2 2 0 0 0-2 2v17.172l-3-3V13a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7a2 2 0 0 0 .586 1.414L18 27.828V35a2 2 0 0 0 2 2 2 2 0 0 0 2-2V23.828l6.414-6.414A2 2 0 0 0 29 16V9a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6.172l-3 3V5a2 2 0 0 0-2-2z" />
        </svg>
      );
    case 'sun':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M19.96.004a1.002 1.002 0 00-.163.02 1.002 1.002 0 00-.083.022 1.002 1.002 0 00-.08.027 1.002 1.002 0 00-.075.037 1.002 1.002 0 00-.325.258 1.002 1.002 0 00-.053.068 1.002 1.002 0 00-.114.223 1.002 1.002 0 00-.045.162 1.002 1.002 0 00-.012.084 1.002 1.002 0 00-.007.087v5a1.002 1.002 0 00.004.086 1.002 1.002 0 00.174.47 1.002 1.002 0 00.049.064 1.002 1.002 0 00.057.064 1.002 1.002 0 00.128.113 1.002 1.002 0 00.14.087 1.002 1.002 0 00.076.03 1.002 1.002 0 00.083.03 1.002 1.002 0 00.08.02 1.002 1.002 0 00.083.015 1.002 1.002 0 00.495-.06 1.002 1.002 0 00.076-.038 1.002 1.002 0 00.329-.258 1.002 1.002 0 00.094-.136 1.002 1.002 0 00.038-.075 1.002 1.002 0 00.038-.076 1.002 1.002 0 00.023-.083 1.002 1.002 0 00.03-.167 1.002 1.002 0 00.004-.083V.988a1.002 1.002 0 000-.087 1.002 1.002 0 00-.038-.167 1.002 1.002 0 00-.023-.075 1.002 1.002 0 00-.068-.155 1.002 1.002 0 00-.045-.072 1.002 1.002 0 00-.11-.129 1.002 1.002 0 00-.06-.056 1.002 1.002 0 00-.209-.14 1.002 1.002 0 00-.238-.084 1.002 1.002 0 00-.083-.015 1.002 1.002 0 00-.166-.007zm-9.43 2.542a1.002 1.002 0 00-.082.004 1.002 1.002 0 00-.167.022 1.002 1.002 0 00-.442.235 1.002 1.002 0 00-.114.12 1.002 1.002 0 00-.049.069 1.002 1.002 0 00-.113.227 1.002 1.002 0 00-.038.163 1.002 1.002 0 00-.012.25 1.002 1.002 0 00.008.082 1.002 1.002 0 00.019.084 1.002 1.002 0 00.026.079 1.002 1.002 0 00.068.151 1.002 1.002 0 000 .004l2.504 4.334a1.002 1.002 0 00.046.068 1.002 1.002 0 00.049.068 1.002 1.002 0 00.057.06 1.002 1.002 0 00.064.058 1.002 1.002 0 00.136.098 1.002 1.002 0 00.151.072 1.002 1.002 0 00.163.045 1.002 1.002 0 00.083.015 1.002 1.002 0 00.416-.045 1.002 1.002 0 00.076-.03 1.002 1.002 0 00.287-.178 1.002 1.002 0 00.114-.121 1.002 1.002 0 00.049-.068 1.002 1.002 0 00.045-.076 1.002 1.002 0 00.068-.151 1.002 1.002 0 00.023-.08 1.002 1.002 0 00.015-.083 1.002 1.002 0 00.015-.083 1.002 1.002 0 000-.087 1.002 1.002 0 00-.015-.163 1.002 1.002 0 00-.113-.321l-2.497-4.33a1.002 1.002 0 00-.11-.14 1.002 1.002 0 00-.056-.06 1.002 1.002 0 00-.06-.058 1.002 1.002 0 00-.212-.136 1.002 1.002 0 00-.076-.034 1.002 1.002 0 00-.166-.041 1.002 1.002 0 00-.167-.023zm18.953 0a1.002 1.002 0 00-.48.14 1.002 1.002 0 00-.068.045 1.002 1.002 0 00-.238.235 1.002 1.002 0 00-.05.072l-2.503 4.326a1.002 1.002 0 00-.038.076 1.002 1.002 0 00-.034.075 1.002 1.002 0 00-.023.084 1.002 1.002 0 00-.019.083 1.002 1.002 0 00-.011.25 1.002 1.002 0 00.007.083 1.002 1.002 0 00.042.162 1.002 1.002 0 00.068.155 1.002 1.002 0 00.095.14 1.002 1.002 0 00.056.065 1.002 1.002 0 00.121.113 1.002 1.002 0 00.072.05 1.002 1.002 0 00.072.037 1.002 1.002 0 00.235.09 1.002 1.002 0 00.416.008 1.002 1.002 0 00.083-.019 1.002 1.002 0 00.159-.056 1.002 1.002 0 00.075-.042 1.002 1.002 0 00.137-.094 1.002 1.002 0 00.12-.118 1.002 1.002 0 00.099-.14l2.5-4.334a1.002 1.002 0 00.072-.151 1.002 1.002 0 00.023-.08 1.002 1.002 0 00.03-.166 1.002 1.002 0 000-.17 1.002 1.002 0 00-.117-.4 1.002 1.002 0 00-.152-.201 1.002 1.002 0 00-.12-.114 1.002 1.002 0 00-.073-.049 1.002 1.002 0 00-.147-.076 1.002 1.002 0 00-.076-.034 1.002 1.002 0 00-.083-.019 1.002 1.002 0 00-.083-.015 1.002 1.002 0 00-.083-.011 1.002 1.002 0 00-.087 0zm-9.478 6.448A11.006 11.005 0 009 20a11.006 11.005 0 0011.006 11.009 11.006 11.005 0 0011.006-11.006A11.006 11.005 0 0020.005 8.998zm-16.452.51a1.002 1.002 0 00-.083 0 1.002 1.002 0 00-.167.027 1.002 1.002 0 00-.076.027 1.002 1.002 0 00-.079.03 1.002 1.002 0 00-.076.038 1.002 1.002 0 00-.075.041 1.002 1.002 0 00-.19.163 1.002 1.002 0 00-.052.064 1.002 1.002 0 00-.05.076 1.002 1.002 0 00-.075.144 1.002 1.002 0 00-.034.08 1.002 1.002 0 00-.02.082 1.002 1.002 0 00-.026.167 1.002 1.002 0 000 .083 1.002 1.002 0 00.016.166 1.002 1.002 0 00.018.083 1.002 1.002 0 00.061.156 1.002 1.002 0 00.136.211 1.002 1.002 0 00.057.065 1.002 1.002 0 00.2.155l4.33 2.503a1.002 1.002 0 00.077.038 1.002 1.002 0 00.242.076 1.002 1.002 0 00.25.011 1.002 1.002 0 00.325-.083 1.002 1.002 0 00.34-.246 1.002 1.002 0 00.053-.064 1.002 1.002 0 00.155-.295 1.002 1.002 0 00.038-.167 1.002 1.002 0 00.011-.083 1.002 1.002 0 00-.004-.166 1.002 1.002 0 00-.06-.246 1.002 1.002 0 00-.117-.223 1.002 1.002 0 00-.106-.129 1.002 1.002 0 00-.129-.11 1.002 1.002 0 00-.072-.045L4.037 9.63a1.002 1.002 0 00-.151-.069 1.002 1.002 0 00-.246-.052 1.002 1.002 0 00-.083-.004zm32.905 0a1.002 1.002 0 00-.087 0 1.002 1.002 0 00-.084.012 1.002 1.002 0 00-.162.045 1.002 1.002 0 00-.076.03 1.002 1.002 0 00-.075.039l-4.339 2.503a1.002 1.002 0 00-.068.046 1.002 1.002 0 00-.068.049 1.002 1.002 0 00-.06.056 1.002 1.002 0 00-.19.277 1.002 1.002 0 00-.083.238 1.002 1.002 0 00-.015.253 1.002 1.002 0 00.023.163 1.002 1.002 0 00.132.31 1.002 1.002 0 00.046.072 1.002 1.002 0 00.053.064 1.002 1.002 0 00.06.06 1.002 1.002 0 00.064.054 1.002 1.002 0 00.069.049 1.002 1.002 0 00.071.045 1.002 1.002 0 00.076.038 1.002 1.002 0 00.076.03 1.002 1.002 0 00.083.023 1.002 1.002 0 00.08.015 1.002 1.002 0 00.086.015 1.002 1.002 0 00.167 0 1.002 1.002 0 00.083-.015 1.002 1.002 0 00.083-.015 1.002 1.002 0 00.235-.095l4.334-2.503a1.002 1.002 0 00.068-.046 1.002 1.002 0 00.068-.053 1.002 1.002 0 00.06-.056 1.002 1.002 0 00.057-.06 1.002 1.002 0 00.099-.137 1.002 1.002 0 00.072-.151 1.002 1.002 0 00.045-.167 1.002 1.002 0 00.011-.08 1.002 1.002 0 00.004-.17 1.002 1.002 0 00-.007-.083 1.002 1.002 0 00-.016-.083 1.002 1.002 0 00-.022-.08 1.002 1.002 0 00-.03-.079 1.002 1.002 0 00-.038-.075 1.002 1.002 0 00-.038-.076 1.002 1.002 0 00-.05-.068 1.002 1.002 0 00-.241-.227 1.002 1.002 0 00-.076-.045 1.002 1.002 0 00-.076-.038 1.002 1.002 0 00-.075-.03 1.002 1.002 0 00-.163-.038 1.002 1.002 0 00-.17-.015zM.988 19.002a1.002 1.002 0 00-.087.004 1.002 1.002 0 00-.166.03 1.002 1.002 0 00-.303.144 1.002 1.002 0 00-.064.05 1.002 1.002 0 00-.064.056 1.002 1.002 0 00-.057.06 1.002 1.002 0 00-.053.068 1.002 1.002 0 00-.049.069 1.002 1.002 0 00-.076.15 1.002 1.002 0 00-.06.243 1.002 1.002 0 00.011.333 1.002 1.002 0 00.344.567 1.002 1.002 0 00.068.05 1.002 1.002 0 00.224.116 1.002 1.002 0 00.075.027 1.002 1.002 0 00.087.019 1.002 1.002 0 00.083.011 1.002 1.002 0 00.087.004h5a1.002 1.002 0 00.17-.015 1.002 1.002 0 00.084-.02 1.002 1.002 0 00.23-.094 1.002 1.002 0 00.072-.045 1.002 1.002 0 00.065-.053 1.002 1.002 0 00.064-.057 1.002 1.002 0 00.057-.06 1.002 1.002 0 00.174-.284 1.002 1.002 0 00.049-.163 1.002 1.002 0 00-.019-.499 1.002 1.002 0 00-.026-.08 1.002 1.002 0 00-.122-.218 1.002 1.002 0 00-.052-.065 1.002 1.002 0 00-.061-.064 1.002 1.002 0 00-.06-.053 1.002 1.002 0 00-.137-.098 1.002 1.002 0 00-.4-.125A1.002 1.002 0 005.987 19H.992zm33.019 0a1.002 1.002 0 00-.167.015 1.002 1.002 0 00-.158.046 1.002 1.002 0 00-.076.034 1.002 1.002 0 00-.216.132 1.002 1.002 0 00-.219.254 1.002 1.002 0 00-.042.075 1.002 1.002 0 00-.098.318 1.002 1.002 0 00-.008.17 1.002 1.002 0 00.008.083 1.002 1.002 0 00.038.163 1.002 1.002 0 00.023.08 1.002 1.002 0 00.037.075 1.002 1.002 0 00.137.212 1.002 1.002 0 00.26.212 1.002 1.002 0 00.076.037 1.002 1.002 0 00.076.038 1.002 1.002 0 00.08.023 1.002 1.002 0 00.082.019 1.002 1.002 0 00.084.011 1.002 1.002 0 00.087.004h5.003a1.002 1.002 0 00.167-.015 1.002 1.002 0 00.083-.02 1.002 1.002 0 00.23-.094 1.002 1.002 0 00.14-.098 1.002 1.002 0 00.175-.182 1.002 1.002 0 00.087-.143 1.002 1.002 0 00.06-.155 1.002 1.002 0 00-.026-.662 1.002 1.002 0 00-.121-.22 1.002 1.002 0 00-.114-.128 1.002 1.002 0 00-.196-.151 1.002 1.002 0 00-.076-.038 1.002 1.002 0 00-.238-.076 1.002 1.002 0 00-.17-.019h-5zm-26.15 7.012a1.002 1.002 0 00-.163.015 1.002 1.002 0 00-.083.019 1.002 1.002 0 00-.238.095l-4.33 2.5a1.002 1.002 0 00-.073.045 1.002 1.002 0 00-.128.113 1.002 1.002 0 00-.106.125 1.002 1.002 0 00-.046.072 1.002 1.002 0 00-.075.151 1.002 1.002 0 00-.023.08 1.002 1.002 0 00-.034.166 1.002 1.002 0 00-.008.083 1.002 1.002 0 00.08.409 1.002 1.002 0 00.076.151 1.002 1.002 0 00.049.068 1.002 1.002 0 00.056.064 1.002 1.002 0 00.057.06 1.002 1.002 0 00.133.107 1.002 1.002 0 00.15.08 1.002 1.002 0 00.076.03 1.002 1.002 0 00.163.041 1.002 1.002 0 00.083.011 1.002 1.002 0 00.25-.011 1.002 1.002 0 00.163-.042 1.002 1.002 0 00.079-.034 1.002 1.002 0 00.076-.037l4.334-2.5a1.002 1.002 0 00.136-.099 1.002 1.002 0 00.06-.056 1.002 1.002 0 00.057-.065 1.002 1.002 0 00.053-.064 1.002 1.002 0 00.144-.303 1.002 1.002 0 00.019-.083 1.002 1.002 0 00.019-.25 1.002 1.002 0 00-.076-.328 1.002 1.002 0 00-.37-.447 1.002 1.002 0 00-.076-.041 1.002 1.002 0 00-.076-.038 1.002 1.002 0 00-.075-.03 1.002 1.002 0 00-.08-.027 1.002 1.002 0 00-.083-.015 1.002 1.002 0 00-.083-.011 1.002 1.002 0 00-.087 0zm24.3 0a1.002 1.002 0 00-.083 0 1.002 1.002 0 00-.083.011 1.002 1.002 0 00-.083.02 1.002 1.002 0 00-.076.022 1.002 1.002 0 00-.083.03 1.002 1.002 0 00-.148.083 1.002 1.002 0 00-.068.05 1.002 1.002 0 00-.125.113 1.002 1.002 0 00-.14.208 1.002 1.002 0 00-.037.076 1.002 1.002 0 00-.053.158 1.002 1.002 0 00-.027.254 1.002 1.002 0 00.02.163 1.002 1.002 0 00.018.083 1.002 1.002 0 00.027.08 1.002 1.002 0 00.034.079 1.002 1.002 0 00.136.211 1.002 1.002 0 00.057.06 1.002 1.002 0 00.124.114 1.002 1.002 0 00.072.046l4.335 2.5a1.002 1.002 0 00.15.071 1.002 1.002 0 00.25.053 1.002 1.002 0 00.167 0 1.002 1.002 0 00.083-.007 1.002 1.002 0 00.163-.042 1.002 1.002 0 00.227-.113 1.002 1.002 0 00.189-.163 1.002 1.002 0 00.056-.064 1.002 1.002 0 00.087-.144 1.002 1.002 0 00.069-.151 1.002 1.002 0 00.045-.25 1.002 1.002 0 000-.087 1.002 1.002 0 000-.083 1.002 1.002 0 00-.06-.242 1.002 1.002 0 00-.03-.08 1.002 1.002 0 00-.088-.143 1.002 1.002 0 00-.11-.129 1.002 1.002 0 00-.06-.06 1.002 1.002 0 00-.064-.05 1.002 1.002 0 00-.076-.049l-4.33-2.5a1.002 1.002 0 00-.152-.071 1.002 1.002 0 00-.08-.023 1.002 1.002 0 00-.166-.03 1.002 1.002 0 00-.087 0zM12.97 31.145a1.002 1.002 0 00-.083.008 1.002 1.002 0 00-.083.011 1.002 1.002 0 00-.083.019 1.002 1.002 0 00-.367.197 1.002 1.002 0 00-.064.056 1.002 1.002 0 00-.11.125 1.002 1.002 0 00-.046.072l-2.503 4.334a1.002 1.002 0 00-.095.235 1.002 1.002 0 00-.03.25 1.002 1.002 0 00.053.328 1.002 1.002 0 00.03.076 1.002 1.002 0 00.129.22 1.002 1.002 0 00.177.177 1.002 1.002 0 00.076.05 1.002 1.002 0 00.223.105 1.002 1.002 0 00.163.038 1.002 1.002 0 00.336-.008 1.002 1.002 0 00.163-.045 1.002 1.002 0 00.288-.17 1.002 1.002 0 00.174-.182 1.002 1.002 0 00.045-.072l2.504-4.334a1.002 1.002 0 00.068-.151 1.002 1.002 0 00.026-.08 1.002 1.002 0 00.015-.087 1.002 1.002 0 00.004-.332 1.002 1.002 0 00-.019-.084 1.002 1.002 0 00-.185-.374 1.002 1.002 0 00-.114-.125 1.002 1.002 0 00-.132-.098 1.002 1.002 0 00-.076-.042 1.002 1.002 0 00-.15-.068 1.002 1.002 0 00-.167-.038 1.002 1.002 0 00-.083-.007 1.002 1.002 0 00-.084 0zm14.07 0a1.002 1.002 0 00-.25.027 1.002 1.002 0 00-.162.052 1.002 1.002 0 00-.076.038 1.002 1.002 0 00-.14.087 1.002 1.002 0 00-.181.178 1.002 1.002 0 00-.2.454 1.002 1.002 0 00-.012.087 1.002 1.002 0 000 .083 1.002 1.002 0 00.011.166 1.002 1.002 0 00.042.163 1.002 1.002 0 00.068.151 1.002 1.002 0 000 .004l2.504 4.334a1.002 1.002 0 00.045.068 1.002 1.002 0 00.238.239 1.002 1.002 0 00.144.083 1.002 1.002 0 00.817.019 1.002 1.002 0 00.151-.076 1.002 1.002 0 00.068-.05 1.002 1.002 0 00.065-.052 1.002 1.002 0 00.06-.06 1.002 1.002 0 00.057-.061 1.002 1.002 0 00.05-.068 1.002 1.002 0 00.113-.227 1.002 1.002 0 00.022-.083 1.002 1.002 0 00.015-.08 1.002 1.002 0 00.016-.17 1.002 1.002 0 00-.016-.166 1.002 1.002 0 00-.041-.163 1.002 1.002 0 00-.034-.076 1.002 1.002 0 00-.038-.075l-2.5-4.338a1.002 1.002 0 00-.045-.068 1.002 1.002 0 00-.239-.238 1.002 1.002 0 00-.072-.046 1.002 1.002 0 00-.075-.038 1.002 1.002 0 00-.155-.056 1.002 1.002 0 00-.167-.038 1.002 1.002 0 00-.083 0zm-7.076 1.88a1.002 1.002 0 00-.48.143 1.002 1.002 0 00-.069.05 1.002 1.002 0 00-.128.11 1.002 1.002 0 00-.053.064 1.002 1.002 0 00-.053.064 1.002 1.002 0 00-.144.302 1.002 1.002 0 00-.034.254v5.003a1.002 1.002 0 00.004.084 1.002 1.002 0 00.011.083 1.002 1.002 0 00.076.238 1.002 1.002 0 00.038.076 1.002 1.002 0 00.098.14 1.002 1.002 0 00.057.064 1.002 1.002 0 00.268.196 1.002 1.002 0 00.076.035 1.002 1.002 0 00.083.026 1.002 1.002 0 00.08.023 1.002 1.002 0 00.253.019 1.002 1.002 0 00.73-.363 1.002 1.002 0 00.094-.137 1.002 1.002 0 00.133-.484v-5.003a1.002 1.002 0 000-.083 1.002 1.002 0 00-.015-.087 1.002 1.002 0 00-.02-.08 1.002 1.002 0 00-.14-.302 1.002 1.002 0 00-.052-.068 1.002 1.002 0 00-.057-.065 1.002 1.002 0 00-.125-.11 1.002 1.002 0 00-.143-.086 1.002 1.002 0 00-.239-.084 1.002 1.002 0 00-.083-.015 1.002 1.002 0 00-.166-.007z" />
        </svg>
      );
    case 'frame':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M30 29H10V11h20zm1 1V10H9v20zm1 1H8V9h24zm2 2V7H6v26z" />
        </svg>
      );
    case 'meta':
      return (
        <svg className={className} viewBox="0 0 40 40">
          <path d="M31.596 9.683c0-1.494-.265-2.396-.795-2.705-.518-.322-1.452-.483-2.801-.483V3.539l1.608-.039c1.904 0 3.26.444 4.067 1.333.819.889 1.229 2.3 1.229 4.231v6.164c0 1.25.192 2.106.578 2.57.398.463.904.766 1.518.908v2.801c-1.398.31-2.096 1.385-2.096 3.227v6.472c0 1.88-.428 3.233-1.284 4.057-.843.825-2.21 1.237-4.102 1.237-.337 0-.843-.013-1.518-.039v-2.956c1.518 0 2.494-.206 2.928-.618.445-.412.668-1.243.668-2.492zM18 25v5h-5v-5zm9 0v5h-5v-5ZM8.404 30.317c0 1.494.265 2.396.795 2.705.53.322 1.464.483 2.801.483v2.956l-1.627.039c-1.843 0-3.186-.425-4.03-1.275-.843-.85-1.265-2.28-1.265-4.29v-6.163c0-1.262-.198-2.119-.596-2.57A2.753 2.753 0 0 0 3 21.295v-2.801c1.386-.31 2.078-1.385 2.078-3.227V8.794c0-1.88.422-3.233 1.265-4.057C7.2 3.912 8.578 3.5 10.482 3.5c.325 0 .831.013 1.518.039v2.956c-1.518 0-2.5.206-2.946.618-.434.412-.65 1.243-.65 2.492z" />
        </svg>
      );
    default:
      return null;
  }
};

SVG.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

SVG.defaultProps = {
  className: null,
};

export default SVG;
