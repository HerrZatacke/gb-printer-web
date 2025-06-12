import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { portDeviceLabels } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';

interface Props {
  inline?: boolean,
}

function ConnectSerial({ inline }: Props) {
  const {
    webUSBActivePorts,
    webUSBIsReceiving,
    webUSBEnabled,
    openWebUSB,
    webSerialActivePorts,
    webSerialIsReceiving,
    webSerialEnabled,
    openWebSerial,
    unknownDeviceResponse,
    hasInactiveDevices,
  } = usePortsContext();

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
            loading={webUSBIsReceiving}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            Open WebUSB device
            {webUSBIsReceiving ? ' (receiving)' : null}
          </Button>
          <Typography variant="body2">
            {`Connected devices (${webUSBActivePorts.length}):`}
          </Typography>
          <ul>
            {webUSBActivePorts.map((usbPort, index) => (
              <Stack
                component="li"
                direction="row"
                gap={2}
                key={index}
                alignItems="baseline"
              >
                <Typography variant="body1" component="span">
                  {`Type: ${portDeviceLabels[usbPort.portDeviceType]}`}
                </Typography>
                <Typography variant="caption" component="span">
                  {`"${usbPort.description}"`}
                </Typography>
              </Stack>
            ))}
          </ul>
        </Stack>

        <Stack
          direction="column"
          gap={1}
        >
          <Button
            title="Open Web Serial device"
            onClick={openWebSerial}
            disabled={!webSerialEnabled}
            loading={webSerialIsReceiving}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            Open Web Serial device
            {webSerialIsReceiving ? ' (receiving)' : null}
          </Button>
          <Typography variant="body2">
            {`${webSerialActivePorts.length} devices connected`}
          </Typography>
          <ul>
            {webSerialActivePorts.map((serialPort, index) => (
              <Stack
                component="li"
                direction="row"
                gap={2}
                key={index}
                alignItems="baseline"
              >
                <Typography variant="body1" component="span">
                  {`Type: ${portDeviceLabels[serialPort.portDeviceType]}`}
                </Typography>
                <Typography variant="caption" component="span">
                  {serialPort.description}
                </Typography>
              </Stack>
            ))}
          </ul>
        </Stack>
      </Stack>
      <Button
        title="Show message from unrecognized device"
        onClick={() => {
          if (!unknownDeviceResponse) {
            alert('no message received');
            return;
          }

          const containsUnreadableChars = unknownDeviceResponse.bytes.some(byte => (
            byte < 32 && byte !== 9 && byte !== 10 && byte !== 13  // tab, cr, lf
          ));

          const message = containsUnreadableChars ? [...unknownDeviceResponse.bytes].join(',') : unknownDeviceResponse.string;

          alert(message);
        }}
        disabled={!hasInactiveDevices}
        variant="contained"
        color={hasInactiveDevices ? 'error' : 'secondary'}
      >
        Show message from unrecognized device
      </Button>
    </Stack>
  );
}

export default ConnectSerial;
