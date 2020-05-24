import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const BOXES = [
  {
    propKey: 'isR',
    cssModifier: 'red',
    updateKey: 'r',
  },
  {
    propKey: 'isG',
    cssModifier: 'green',
    updateKey: 'g',
  },
  {
    propKey: 'isB',
    cssModifier: 'blue',
    updateKey: 'b',
  },
  {
    propKey: 'isN',
    cssModifier: 'normal',
    updateKey: 'n',
  },
];

const RGBNSelect = (props) => (
  <div className="rgbn-select">
    {
      BOXES.map(({ propKey, cssModifier, updateKey }) => (
        <button
          type="button"
          key={propKey}
          className={
            classnames(`rgbn-select__button rgbn-select__button--${cssModifier}`, {
              'rgbn-select__button--selected': props[propKey],
            })
          }
          onClick={() => {
            props.updateRGBN(updateKey, !props[propKey]);
          }}
        >
          <SVG name="circle" />
        </button>
      ))
    }
  </div>
);

RGBNSelect.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  isR: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isG: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isB: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isN: PropTypes.bool.isRequired,
  updateRGBN: PropTypes.func.isRequired,
};

RGBNSelect.defaultProps = {
};

export default RGBNSelect;
