import React from 'react';
import classnames from 'classnames';
import Input, { InputType } from '../../../Input';

interface APConfig {
  ssid: string,
  psk: string,
  delete: boolean,
}

interface Props extends APConfig {
  id: string,
  isNew: boolean,
  update: (value: Partial<APConfig>) => void,
  disabled: boolean,
}

const APConfig = (props: Props) => (
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
      type={InputType.TEXT}
      value={props.ssid}
      disabled={!props.isNew || props.disabled}
      onChange={(ssid) => {
        props.update({
          ssid: ssid as string,
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
      type={InputType.PASSWORD}
      value={props.psk}
      disabled={props.disabled}
      onChange={(psk) => {
        props.update({
          psk: psk as string,
        });
      }}
    />
  </div>
);

export default APConfig;
