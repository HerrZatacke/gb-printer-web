import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React from 'react';
import { textFieldSlotDefaults } from '@/consts/textFieldSlotDefaults';
import { useAsPasswordField } from '@/hooks/useAsPasswordField';

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

function APConfig(props: Props) {
  const { type, button } = useAsPasswordField();
  const t = useTranslations('SettingsWiFi');

  return (
    <Card
      raised
      component="li"
    >
      <CardContent>
        <Stack
          direction="column"
          gap={4}
        >
          <TextField
            id={`${props.id}-settings-ap-ssid`}
            label={t('networkSSID')}
            type="text"
            value={props.ssid}
            slotProps={{
              ...textFieldSlotDefaults,
              input: {
                endAdornment: (
                  <IconButton
                    title={t('deleteNetwork')}
                    color="primary"
                    onClick={() => {
                      props.update({
                        delete: !props.delete,
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ),
              },
            }}
            disabled={!props.isNew || props.disabled}
            onChange={(ev) => {
              const ssid = ev.target.value;
              props.update({ ssid });
            }}
          />


          <TextField
            id={`${props.id}-settings-ap-psk`}
            label={t('networkPassword')}
            type={type}
            slotProps={{
              ...textFieldSlotDefaults,
              input: {
                endAdornment: button,
              },
            }}
            value={props.psk}
            disabled={props.disabled}
            onChange={(ev) => {
              const psk = ev.target.value;
              props.update({ psk });
            }}
          />

          { props.delete && (
            <Alert
              severity="error"
              icon={<DeleteIcon fontSize="inherit" />}
            >
              {t('willDeleteNetwork')}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default APConfig;
