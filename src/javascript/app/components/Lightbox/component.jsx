import React from 'react';
import PropTypes from 'prop-types';
import Buttons from '../Buttons';

const Lightbox = (props) => (
  <div className={`${props.className} lightbox`}>
    <button
      type="button"
      className="lightbox__backdrop"
      onClick={props.deny}
    />
    <div
      className="lightbox__box"
      style={{
        height: props.height ? `${props.height}px` : null,
      }}
    >
      <div className="lightbox__box-content">
        <div className="lightbox__header">
          {props.header}
        </div>
        {props.children}
      </div>
      <Buttons
        confirm={props.confirm}
        deny={props.deny}
      />
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
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func.isRequired,
};

Lightbox.defaultProps = {
  height: null,
  header: null,
  className: '',
};

export default Lightbox;
