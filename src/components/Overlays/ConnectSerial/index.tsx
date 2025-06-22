import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import UsbIcon from '@mui/icons-material/Usb';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { portDeviceLabels, PortType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import useSettingsStore from '@/stores/settingsStore';

interface Props {
  inline?: boolean,
}

function ConnectSerial({ inline }: Props) {
  const {
    connectedDevices,
    webUSBEnabled,
    openWebUSB,
    webSerialEnabled,
    openWebSerial,
    unknownDeviceResponse,
    hasInactiveDevices,
  } = usePortsContext();

  const { enableDebug } = useSettingsStore();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Stack
        direction={{ xs: 'column', md: inline ? 'row' : 'column' }}
        gap={4}
        sx={{ '& > *': { flex: 1 } }}
      >
        <Stack
          direction="column"
          gap={1}
        >
          <Button
            title="Open WebUSB device"
            onClick={openWebUSB}
            disabled={!webUSBEnabled}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            Open WebUSB device
          </Button>
        </Stack>

        <Stack
          direction="column"
          gap={1}
        >
          <Button
            title="Open Web Serial device"
            onClick={openWebSerial}
            disabled={!webSerialEnabled}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            Open Web Serial device
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2">
        {`Connected devices (${connectedDevices.length}):`}
      </Typography>
      <ul>
        {connectedDevices.map(({ id, portType, portDeviceType, description }) => {
          const Icon = portType === PortType.SERIAL ? SettingsInputHdmiIcon : UsbIcon;
          return (
            <Stack
              component="li"
              direction="row"
              gap={2}
              key={id}
              alignItems="baseline"
            >
              <Typography variant="body1" component="span">
                <Icon sx={{
                  fontSize: 'inherit',
                  verticalAlign: 'middle',
                  mr: 1,
                }}/>
                {`Type: ${portDeviceLabels[portDeviceType]}`}
              </Typography>
              <Typography variant="caption" component="span">
                {enableDebug ? `${description} - ${id}` : description}
              </Typography>
            </Stack>
          );
        })}
      </ul>

      <Button
        title="Show message from unrecognized device"
        onClick={() => {
          if (!unknownDeviceResponse) { return; }

          const containsUnreadableChars = [...unknownDeviceResponse].some(byte => (
            byte < 32 && byte !== 9 && byte !== 10 && byte !== 13  // tab, cr, lf
          ));

          const message = containsUnreadableChars ?
            [...unknownDeviceResponse].join(',') :
            (new TextDecoder()).decode(unknownDeviceResponse);

          alert(message);
        }}
        disabled={!(hasInactiveDevices && unknownDeviceResponse)}
        variant="contained"
        color={hasInactiveDevices ? 'error' : 'secondary'}
      >
        Show message from unrecognized device
      </Button>
    </Stack>
  );
}

export default ConnectSerial;
