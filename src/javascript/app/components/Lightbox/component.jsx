import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Buttons from '../Buttons';

const Lightbox = (props) => (
  <div
    className={
      classNames(`lightbox ${props.className}`, {
        'lightbox--fullscreen': props.isFullscreen,
      })
    }
  >
    <button
      type="button"
      className={`lightbox__backdrop ${props.className}__backdrop`}
      onClick={props.denyOnOverlayClick ? props.deny : null}
    />
    <div
      className={`lightbox__box ${props.className}__box`}
      style={{
        height: props.height ? `${props.height}px` : null,
      }}
    >
      <div
        className={`lightbox__box-content ${props.className}__box-content`}
      >
        { props.header ? (
          <div
            className={`lightbox__header ${props.className}__header`}
          >
            {props.header}
          </div>
        ) : null}
        {props.children}
      </div>
      { props.confirm || props.deny ? (
        <Buttons
          focusConfirm={props.focusConfirm}
          confirm={props.confirm}
          canConfirm={props.canConfirm}
          deny={props.deny}
        />
      ) : null }
    </div>
  </div>
);

Lightbox.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  header: PropTypes.string,
  isFullscreen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  confirm: PropTypes.func,
  deny: PropTypes.func,
  canConfirm: PropTypes.bool,
  focusConfirm: PropTypes.bool,
  denyOnOverlayClick: PropTypes.bool,
};

Lightbox.defaultProps = {
  height: null,
  header: null,
  isFullscreen: false,
  className: '',
  confirm: null,
  children: null,
  deny: null,
  canConfirm: true,
  focusConfirm: true,
  denyOnOverlayClick: true,
};

export default Lightbox;
