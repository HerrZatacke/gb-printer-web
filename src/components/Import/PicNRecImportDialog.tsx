'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import Lightbox from '@/components/Lightbox';
import { missingGreyPalette } from '@/consts/defaults';
import { useItemsStore, useSettingsStore } from '@/stores/stores';

const FIRST_IMAGE_SLOT = 1;

interface PicNRecImportDialogProps {
  open: boolean,
  loading: boolean,
  busy: boolean,
  canImport: boolean,
  closeDialog: () => void,
  confirmImport: () => void,
  clearLastImageLocation: () => void,
  deviceInfo: {
    imageCount: number,
    lastImageIndex: number,
    maxSupportedImageIndex: number,
  } | null,
  startImageNumber: string,
  setStartImageNumber: (value: string) => void,
  endImageNumber: string,
  setEndImageNumber: (value: string) => void,
  previewImageNumber: number,
  setPreviewImageNumber: (value: number) => void,
  previewTiles: string[] | null,
  previewStatus: string,
  previewLoading: boolean,
  rangeError: string,
}

function PicNRecImportDialog({
  open,
  loading,
  busy,
  canImport,
  closeDialog,
  confirmImport,
  clearLastImageLocation,
  deviceInfo,
  startImageNumber,
  setStartImageNumber,
  endImageNumber,
  setEndImageNumber,
  previewImageNumber,
  setPreviewImageNumber,
  previewTiles,
  previewStatus,
  previewLoading,
  rangeError,
}: PicNRecImportDialogProps) {
  const { activePalette } = useSettingsStore();
  const { palettes } = useItemsStore();

  const palette = useMemo(() => (
    palettes.find(({ shortName }) => shortName === activePalette)?.palette || missingGreyPalette.palette
  ), [activePalette, palettes]);

  const defaultLastSlot = Math.max(FIRST_IMAGE_SLOT, deviceInfo?.lastImageIndex ?? FIRST_IMAGE_SLOT);

  const rangeButtonsSx = {
    minWidth: 52,
    px: 0.75,
    py: 0.25,
    fontSize: '0.7rem',
    lineHeight: 1.2,
  };

  const rangeFooterSx = {
    minHeight: 28,
    alignItems: 'center',
  };

  const previewStep = (delta: number) => {
    if (!deviceInfo) {
      return;
    }

    setPreviewImageNumber(Math.min(
      deviceInfo.maxSupportedImageIndex,
      Math.max(FIRST_IMAGE_SLOT, previewImageNumber + delta),
    ));
  };

  return (
    <Lightbox
      open={open}
      keepMounted={false}
      header="Import images from PicNRec"
      deny={closeDialog}
      confirm={confirmImport}
      canConfirm={canImport}
      confirmMessage={busy ? 'Importing...' : 'Import'}
      contentWidth={720}
      closeOnOverlayClick={!busy}
      actionButtons={(
        <Box sx={{ mr: 'auto' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={clearLastImageLocation}
            disabled={busy || loading || !deviceInfo}
            sx={{
              borderColor: 'error.main',
              color: 'error.main',
              fontWeight: 700,
            }}
          >
            Clear Last Slot
          </Button>
        </Box>
      )}
    >
      <Stack direction="column" gap={2.25}>
        {loading || !deviceInfo ? (
          <Stack direction="row" gap={2} alignItems="center">
            <CircularProgress size={20} />
            <Typography>Detecting PicNRec device...</Typography>
          </Stack>
        ) : (
          <>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: 'action.hover',
              }}
            >
              <Typography fontWeight={600}>PicNRec import range</Typography>
              <Typography color="text.secondary">
                Detected {deviceInfo.imageCount} available image(s). Preview and import can address slots up to {deviceInfo.maxSupportedImageIndex}.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <Stack gap={0.5}>
                <TextField
                  type="number"
                  label="Start image"
                  value={startImageNumber}
                  onChange={({ target }) => setStartImageNumber(target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      min: FIRST_IMAGE_SLOT,
                      max: deviceInfo.maxSupportedImageIndex,
                    },
                  }}
                  fullWidth
                />
                <Stack direction="row" justifyContent="space-between" gap={1} sx={rangeFooterSx}>
                  <Typography variant="caption" color="text.secondary">
                    {`${FIRST_IMAGE_SLOT}-${deviceInfo.maxSupportedImageIndex}`}
                  </Typography>
                  <Stack direction="row" gap={0.5}>
                        <Button
                          size="small"
                          onClick={() => setStartImageNumber(FIRST_IMAGE_SLOT.toString(10))}
                          sx={rangeButtonsSx}
                        >
                          First
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setStartImageNumber(previewImageNumber.toString(10))}
                          sx={rangeButtonsSx}
                        >
                          Current
                        </Button>
                  </Stack>
                </Stack>
              </Stack>

              <Stack gap={0.5}>
                <TextField
                  type="number"
                  label="End image"
                  value={endImageNumber}
                  onChange={({ target }) => setEndImageNumber(target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      min: FIRST_IMAGE_SLOT,
                      max: deviceInfo.maxSupportedImageIndex,
                    },
                  }}
                  fullWidth
                />
                <Stack direction="row" justifyContent="space-between" gap={1} sx={rangeFooterSx}>
                  <Typography variant="caption" color="text.secondary">
                    {`${FIRST_IMAGE_SLOT}-${deviceInfo.maxSupportedImageIndex}`}
                  </Typography>
                  <Stack direction="row" gap={0.5}>
                        <Button
                          size="small"
                          onClick={() => setEndImageNumber(previewImageNumber.toString(10))}
                          sx={rangeButtonsSx}
                        >
                          Current
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setEndImageNumber(defaultLastSlot.toString(10))}
                          sx={rangeButtonsSx}
                        >
                          Last
                        </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {rangeError ? (
              <Typography color="error">{rangeError}</Typography>
            ) : null}

            <Stack direction="column" gap={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Typography fontWeight={600}>Preview slot {previewImageNumber}</Typography>
                <Stack direction="row" gap={0.75}>
                  <Button size="small" variant="outlined" onClick={() => previewStep(-1)} disabled={previewImageNumber <= FIRST_IMAGE_SLOT}>-</Button>
                  <Button size="small" variant="outlined" onClick={() => previewStep(1)} disabled={previewImageNumber >= deviceInfo.maxSupportedImageIndex}>+</Button>
                  <Button size="small" variant="outlined" onClick={() => setPreviewImageNumber(defaultLastSlot)} disabled={previewImageNumber === defaultLastSlot}>Last</Button>
                </Stack>
              </Stack>
              <Slider
                min={FIRST_IMAGE_SLOT}
                max={deviceInfo.maxSupportedImageIndex}
                step={1}
                value={previewImageNumber}
                onChange={(_, value) => setPreviewImageNumber(value as number)}
                valueLabelDisplay="auto"
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: -0.5, px: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {FIRST_IMAGE_SLOT}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', pr: 0.5 }}>
                  {deviceInfo.maxSupportedImageIndex}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems="stretch">
              <Box
                sx={{
                  flex: '0 0 220px',
                  minHeight: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02))',
                  boxShadow: 1,
                }}
              >
                {previewLoading ? (
                  <CircularProgress size={28} />
                ) : previewTiles ? (
                  <Box
                    sx={{
                      width: 160,
                    }}
                  >
                    <GameBoyImage
                      tiles={previewTiles}
                      invertPalette={false}
                      lockFrame={false}
                      palette={palette}
                      imageStartLine={2}
                      asThumb
                    />
                  </Box>
                ) : (
                  <Typography color="text.secondary">No preview available.</Typography>
                )}
              </Box>

              <Stack
                direction="column"
                gap={1.5}
                justifyContent="space-between"
                sx={{
                  flex: '1 1 auto',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography>{previewStatus}</Typography>
                <Typography color="text.secondary">
                  Move the slider to preview a specific PicNRec slot before importing a range.
                </Typography>
                <Typography color="text.secondary">
                  Deleted or blank-looking slots may still preview if their raw slot data is still present.
                </Typography>
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Lightbox>
  );
}

export default PicNRecImportDialog;
