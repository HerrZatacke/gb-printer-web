import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import UsbIcon from '@mui/icons-material/Usb';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import hasher from 'object-hash';
import React, { useMemo, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { PortDeviceType, PortType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import { useSettingsStore } from '@/stores/stores';

interface Props {
  inline?: boolean,
}

export const portDeviceTranslationKeys: Record<PortDeviceType, string> = {
  [PortDeviceType.INACTIVE]: 'portDeviceTypes.inactiveDevice',
  [PortDeviceType.PACKET_CAPTURE]: 'portDeviceTypes.arduinoGameboyPrinterEmulator',
  [PortDeviceType.SUPER_PRINTER_INTERFACE]: 'portDeviceTypes.superPrinterInterface',
  [PortDeviceType.GBXCART]: 'portDeviceTypes.cartridgeReader',
};

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
  const t = useTranslations('ConnectSerial');

  const [showUnknownDeviceResponse, setShowUnknownDeviceResponse] = useState(false);
  const unknownDeviceResponseInfo = useMemo<string[]>(() => {
    if (!unknownDeviceResponse || !unknownDeviceResponse.length) {
      return [];
    }

    const containsUnreadableChars = [...unknownDeviceResponse].some(byte => (
      byte < 32 && byte !== 9 && byte !== 10 && byte !== 13  // tab, cr, lf
    ));

    const bytes = unknownDeviceResponse.byteLength < 50 ? [...unknownDeviceResponse].join(',') : '';
    const text = containsUnreadableChars ? '' : (new TextDecoder()).decode(unknownDeviceResponse);
    const hash = hasher([...unknownDeviceResponse]);

    return [bytes, text, hash].filter(Boolean);
  }, [unknownDeviceResponse]);

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
            title={t('openWebUSB')}
            onClick={openWebUSB}
            disabled={!webUSBEnabled}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            {t('openWebUSB')}
          </Button>
        </Stack>

        <Stack
          direction="column"
          gap={1}
        >
          <Button
            title={t('openWebSerial')}
            onClick={openWebSerial}
            disabled={!webSerialEnabled}
            loadingPosition="start"
            variant="contained"
            color="secondary"
          >
            {t('openWebSerial')}
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2">
        {t('connectedDevices', { deviceCount: connectedDevices.length })}
      </Typography>
      <Stack
        component="ul"
        direction="column"
        gap={2}
      >
        {connectedDevices.map(({ id, portType, portDeviceType, description }) => {
          const Icon = portType === PortType.SERIAL ? SettingsInputHdmiIcon : UsbIcon;
          return (
            <Stack
              key={id}
              gap={1}
              direction="row"
              alignItems="center"
            >
              <Icon />
              <Stack
                component="li"
                direction={inline ? 'row' : 'column'}
                gap={inline ? 2 : 0}
                alignItems="baseline"
              >
                <Typography variant="body1" component="span">
                  {t(portDeviceTranslationKeys[portDeviceType])}
                </Typography>
                <Typography variant="caption" component="span">
                  {enableDebug ? `${description} - ${id}` : description}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      <Button
        title={t('showUnknownResponse')}
        onClick={() => {
          if (!unknownDeviceResponse) { return; }
          setShowUnknownDeviceResponse(true);
        }}
        disabled={!(hasInactiveDevices && unknownDeviceResponse)}
        variant="contained"
        color="error"
      >
        {t('showUnknownResponse')}
      </Button>
      <Lightbox
        header={t('unknownDeviceInfo')}
        deny={() => setShowUnknownDeviceResponse(false)}
        open={showUnknownDeviceResponse && Boolean(unknownDeviceResponse?.length)}
      >
        <Stack direction="column" gap={2}>
          {unknownDeviceResponseInfo.map((value, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>{value}</Typography>
              <IconButton
                onClick={() => navigator.clipboard.writeText(value)}
                title={t('copyToClipboard')}
              >
                <ContentCopyIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Lightbox>
    </Stack>
  );
}

export default ConnectSerial;
