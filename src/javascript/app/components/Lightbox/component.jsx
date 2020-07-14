import React from 'react';
import PropTypes from 'prop-types';
import Buttons from '../Buttons';

const Lightbox = (props) => (
  <div
    className={`lightbox ${props.className}`}
  >
    <button
      type="button"
      className={`lightbox__backdrop ${props.className}__backdrop`}
      onClick={props.deny}
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
      { props.confirm && props.deny ? (
        <Buttons
          confirm={props.confirm}
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  confirm: PropTypes.func,
  deny: PropTypes.func,
};

Lightbox.defaultProps = {
  height: null,
  header: null,
  className: '',
  confirm: null,
  deny: null,
};

export default Lightbox;
