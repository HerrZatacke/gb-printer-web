import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React from 'react';
import useSettingsStore from '../../stores/settingsStore';

function EnableWebUSB() {
  const { useSerials, setUseSerials } = useSettingsStore();

  return (
    <FormControlLabel
      label="Enable WebUSB / Serial ports"
      control={(
        <Switch
          checked={useSerials}
          onChange={({ target }) => {
            setUseSerials(target.checked);
          }}
        />
      )}
    />
  );
}

export default EnableWebUSB;
