import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Buttons from '../Buttons';
import useOverlayGlobalKeys from '../../../hooks/useOverlayGlobalKeys';
import useAutoFocus from '../../../hooks/useAutoFocus';
import './index.scss';

const Lightbox = (props) => {
  const isFullscreen = useSelector((state) => (state.isFullscreen));

  useOverlayGlobalKeys({
    confirm: props.confirm,
    canConfirm: props.canConfirm,
    deny: props.deny,
  });

  const focusRef = useAutoFocus();

  return (
    <div
      className={
        classNames(`lightbox ${props.className}`, {
          'lightbox--fullscreen': isFullscreen,
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
        // eslint-disable-next-line jsx-a11y/no-autofocus
        ref={focusRef}
        style={{
          height: props.height ? `${props.height}px` : null,
        }}
      >
        <dialog
          className={`lightbox__box-content ${props.className}__box-content`}
          aria-labelledby="lightbox-header"
        >
          {props.header ? (
            <div
              id="lightbox-header"
              className={`lightbox__header ${props.className}__header`}
            >
              {props.header}
            </div>
          ) : null}
          {props.children}
        </dialog>
        {props.confirm || props.deny ? (
          <Buttons
            confirm={props.confirm}
            canConfirm={props.canConfirm}
            deny={props.deny}
          />
        ) : null}
      </div>
    </div>
  );
};

Lightbox.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  header: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  confirm: PropTypes.func,
  deny: PropTypes.func,
  canConfirm: PropTypes.bool,
  denyOnOverlayClick: PropTypes.bool,
};

Lightbox.defaultProps = {
  height: null,
  header: null,
  className: '',
  confirm: null,
  children: null,
  deny: null,
  canConfirm: true,
  denyOnOverlayClick: true,
};

export default Lightbox;
