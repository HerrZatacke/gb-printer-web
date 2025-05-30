import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import useWebSerial from '@/hooks/useWebSerial';
import useWebUSBSerial from '@/hooks/useWebUSBSerial';
import useInteractionsStore from '@/stores/interactionsStore';
import useSettingsStore from '@/stores/settingsStore';

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

  const { useSerials } = useSettingsStore();
  const { showSerials, setShowSerials } = useInteractionsStore();
  const lightBoxOpen = showSerials && useSerials;


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
      confirm={() => setShowSerials(false)}
      canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
    >
      {content}
    </Lightbox>
  );
}

export default ConnectSerial;
