import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTranslations } from 'next-intl';
import React from 'react';
import useSettingsStore from '../../stores/settingsStore';

function EnableWebUSB() {
  const { useSerials, setUseSerials } = useSettingsStore();
  const t = useTranslations('WebUSBGreeting');

  return (
    <FormControlLabel
      label={t('enableWebUsb')}
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
