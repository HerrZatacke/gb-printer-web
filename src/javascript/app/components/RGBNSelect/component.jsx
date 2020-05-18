import React from 'react';
import PropTypes from 'prop-types';

const RGBNSelect = (props) => (
  <div className="rgbn-select">
    <input
      className="rgbn-select__box rgbn-select__box--red"
      checked={props.isR}
      onChange={(ev) => {
        props.updateRGBN('r', ev.target.checked);
      }}
      type="checkbox"
    />
    <input
      className="rgbn-select__box rgbn-select__box--green"
      checked={props.isG}
      onChange={(ev) => {
        props.updateRGBN('g', ev.target.checked);
      }}
      type="checkbox"
    />
    <input
      className="rgbn-select__box rgbn-select__box--blue"
      checked={props.isB}
      onChange={(ev) => {
        props.updateRGBN('b', ev.target.checked);
      }}
      type="checkbox"
    />
    <input
      className="rgbn-select__box rgbn-select__box--normal"
      checked={props.isN}
      onChange={(ev) => {
        props.updateRGBN('n', ev.target.checked);
      }}
      type="checkbox"
    />
  </div>
);

RGBNSelect.propTypes = {
  isR: PropTypes.bool.isRequired,
  isG: PropTypes.bool.isRequired,
  isB: PropTypes.bool.isRequired,
  isN: PropTypes.bool.isRequired,
  updateRGBN: PropTypes.func.isRequired,
};

RGBNSelect.defaultProps = {
};

export default RGBNSelect;
