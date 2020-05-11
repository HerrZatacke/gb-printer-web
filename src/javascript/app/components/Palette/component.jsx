import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = (props) => (
  <tr
    className={
      classnames('palette', {
        'palette--active': props.isActive,
      })
    }
    onClick={() => {
      props.setActive();
    }}
  >
    <td className="palette__shortname">{props.shortName}</td>
    <td className="palette__name">{props.name}</td>
    <td className="palette__color" style={{ backgroundColor: props.palette[0] }} title={props.palette[0]}> </td>
    <td className="palette__color" style={{ backgroundColor: props.palette[1] }} title={props.palette[1]}> </td>
    <td className="palette__color" style={{ backgroundColor: props.palette[2] }} title={props.palette[2]}> </td>
    <td className="palette__color" style={{ backgroundColor: props.palette[3] }} title={props.palette[3]}> </td>
  </tr>
);

Component.propTypes = {
  shortName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Component.defaultProps = {};

export default Component;
