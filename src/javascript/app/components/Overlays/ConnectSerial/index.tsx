import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../../Lightbox';
import useWithStore from './hooks/useWithStore';

interface Props {
  inline?: boolean,
  passive?: boolean,
}

function ConnectSerial({ inline, passive }: Props) {
  const {
    activePorts: usbSerialActivePorts,
    isReceiving: usbSerialIsReceiving,
    webUSBEnabled,
    openWebUSBSerial,
  } = useWebUSBSerial(passive || false);

  const {
    activePorts: webSerialActivePorts,
    isReceiving: webSerialIsReceiving,
    webSerialEnabled,
    openWebSerial,
  } = useWebSerial(passive || false);

  const {
    lightBoxOpen,
    hideSerials,
  } = useWithStore();


  const content = (
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
          onClick={openWebUSBSerial}
          disabled={!webUSBEnabled}
          loading={usbSerialIsReceiving}
          loadingPosition="start"
          variant="contained"
          color="secondary"
        >
          Open WebUSB device
          {usbSerialIsReceiving ? ' (receiving)' : null}
        </Button>
        <Typography variant="body2">
          {`Connected devices (${usbSerialActivePorts.length}):`}
        </Typography>
        <ul>
          {usbSerialActivePorts.map(({ productName }, index) => <li key={index}>{productName}</li>)}
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
      </Stack>
    </Stack>
  );

  if (inline) {
    return content;
  }

  const showOverlay = lightBoxOpen || usbSerialIsReceiving || webSerialIsReceiving;

  return !showOverlay ? null : (
    <Lightbox
      header="WebUSB / Serial devices"
      confirm={hideSerials}
      canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
    >
      {content}
    </Lightbox>
  );
}

export default ConnectSerial;
