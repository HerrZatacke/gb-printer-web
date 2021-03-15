import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../../../Input';

const APConfig = (props) => (
  <div
    className={
      classnames('wifi-settings__ap-group', {
        'wifi-settings__ap-group--delete': props.delete,
      })
    }
  >
    <Input
      id={`${props.id}-settings-ap-ssid`}
      labelText="Network SSID"
      type="text"
      value={props.ssid}
      disabled={!props.isNew || props.disabled}
      onChange={(ssid) => {
        props.update({
          ssid,
        });
      }}
      buttonOnClick={() => {
        props.update({
          delete: !props.delete,
        });
      }}
      buttonIcon="delete"
    />
    <Input
      id={`${props.id}-settings-ap-psk`}
      labelText="Network Password"
      type="password"
      value={props.psk}
      disabled={props.disabled}
      onChange={(psk) => {
        props.update({
          psk,
        });
      }}
    />
  </div>
);

APConfig.propTypes = {
  id: PropTypes.string.isRequired,
  ssid: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  delete: PropTypes.bool.isRequired,
  psk: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default APConfig;
