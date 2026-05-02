import { Remote } from 'comlink';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/PortsContext';
import { useTracking } from '@/contexts/TrackingContext';
import { useDialogsStore, useInteractionsStore, useProgressStore } from '@/stores/stores';
import {
  MAX_SUPPORTED_IMAGE_INDEX,
  PicNRecCommsDevice,
} from '@/tools/comms/DeviceAPIs/PicNRecCommsDevice';
import { concatImportResults } from '@/tools/concatImportResults';
import { transformSav } from '@/tools/transformSav';
import transformImage from '@/tools/transformSav/transformImage';
import { DialoqQuestionType } from '@/consts/dialog';

interface PicNRecDeviceInfo {
  imageCount: number,
  lastImageIndex: number,
  maxSupportedImageIndex: number,
}

interface UsePicNRec {
  picNRecAvailable: boolean,
  openImportDialog: () => void,
  closeImportDialog: () => void,
  importPicNRec: () => void,
  clearPicNRecLastImageLocation: () => void,
  busy: boolean,
  dialogOpen: boolean,
  dialogLoading: boolean,
  deviceInfo: PicNRecDeviceInfo | null,
  previewImageNumber: number,
  setPreviewImageNumber: (value: number) => void,
  previewTiles: string[] | null,
  previewStatus: string,
  previewLoading: boolean,
  startImageNumber: string,
  setStartImageNumber: (value: string) => void,
  endImageNumber: string,
  setEndImageNumber: (value: string) => void,
  rangeError: string,
  canImport: boolean,
}

const IMAGE_SLOT_SIZE = 0x1000;
const IMAGE_DATA_SIZE = 0x0E00;
const PREFIX_SLOT_COUNT = 2;
const ALBUM_INDEX_TABLE_OFFSET = 0x11B2;
const PREVIEW_DEBOUNCE_MS = 250;
const FIRST_IMAGE_SLOT = 1;

const createPicNRecSav = (images: Uint8Array[]): Uint8Array => {
  const slotCount = images.length + PREFIX_SLOT_COUNT;
  const data = new Uint8Array(slotCount * IMAGE_SLOT_SIZE);

  images.forEach((image, index) => {
    if (image.length !== IMAGE_DATA_SIZE) {
      throw new Error(`Expected ${IMAGE_DATA_SIZE} bytes from PicNRec, received ${image.length}.`);
    }

    const baseAddress = (index + PREFIX_SLOT_COUNT) * IMAGE_SLOT_SIZE;
    data.set(image, baseAddress);
    data[ALBUM_INDEX_TABLE_OFFSET + index] = index;
  });

  return data;
};

const toFileBytes = (data: Uint8Array): Uint8Array<ArrayBuffer> => {
  const fileBytes = new Uint8Array(data.byteLength);
  fileBytes.set(data);
  return fileBytes;
};

const parseRange = (startValue: string, endValue: string, maxImageIndex: number): string => {
  const startImageNumber = Number(startValue);
  const endImageNumber = Number(endValue);

  if (!Number.isInteger(startImageNumber) || !Number.isInteger(endImageNumber)) {
    return 'Enter whole-number start and end image numbers.';
  }

  if (startImageNumber < FIRST_IMAGE_SLOT || startImageNumber > maxImageIndex) {
    return `Start must be between ${FIRST_IMAGE_SLOT} and ${maxImageIndex}.`;
  }

  if (endImageNumber < startImageNumber || endImageNumber > maxImageIndex) {
    return `End must be between ${startImageNumber} and ${maxImageIndex}.`;
  }

  return '';
};

const getReportedImageCount = (lastImageNumber: number): number => Math.max(0, lastImageNumber);

const getEffectiveLastImageIndex = (reportedLastImageNumber: number): number => (
  Math.max(0, reportedLastImageNumber - 1)
);

const getEffectiveImageCount = (reportedLastImageNumber: number): number => (
  Math.max(0, getEffectiveLastImageIndex(reportedLastImageNumber))
);

const isImportablePicNRecImage = (image: Uint8Array): boolean => Boolean(transformImage(image, 0));

export const usePicNRec = (): UsePicNRec => {
  const { connectedDevices } = usePortsContext();
  const { sendEvent } = useTracking();
  const { setDialog, dismissDialog } = useDialogsStore();
  const { setError } = useInteractionsStore();
  const { startProgress, setProgress, stopProgress } = useProgressStore();
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<PicNRecDeviceInfo | null>(null);
  const [previewImageNumber, setPreviewImageNumber] = useState(0);
  const [previewTiles, setPreviewTiles] = useState<string[] | null>(null);
  const [previewStatus, setPreviewStatus] = useState('Move the slider to preview a PicNRec slot.');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [startImageNumber, setStartImageNumber] = useState(FIRST_IMAGE_SLOT.toString(10));
  const [endImageNumber, setEndImageNumber] = useState(FIRST_IMAGE_SLOT.toString(10));

  const previewTokenRef = useRef(0);
  const previewTimeoutRef = useRef<number | null>(null);

  const picNRec: Remote<PicNRecCommsDevice> | null = useMemo(() => {
    const deviceMeta = connectedDevices.find((device) => device.portDeviceType === PortDeviceType.PICNREC);

    if (!deviceMeta) {
      return null;
    }

    return deviceMeta.device as Remote<PicNRecCommsDevice>;
  }, [connectedDevices]);

  const rangeError = useMemo(() => {
    if (!deviceInfo) {
      return 'No PicNRec device information loaded.';
    }

    return parseRange(startImageNumber, endImageNumber, deviceInfo.maxSupportedImageIndex);
  }, [deviceInfo, endImageNumber, startImageNumber]);

  const canImport = Boolean(deviceInfo) && !rangeError.length && !busy && !dialogLoading;

  const closeImportDialog = useCallback(() => {
    setDialogOpen(false);
    setPreviewLoading(false);
    previewTokenRef.current += 1;

    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  }, []);

  const openImportDialog = useCallback(async () => {
    if (!picNRec || busy || dialogLoading) {
      return;
    }

    setDialogLoading(true);
    setPreviewTiles(null);
    setPreviewStatus('Detecting PicNRec device...');

    try {
      const reportedLastImageNumber = await picNRec.readLastImageNumber();
      const effectiveLastImageIndex = getEffectiveLastImageIndex(reportedLastImageNumber);
      const imageCount = getEffectiveImageCount(reportedLastImageNumber);
      const defaultEndImage = Math.max(FIRST_IMAGE_SLOT, effectiveLastImageIndex);

      setDeviceInfo({
        imageCount,
        lastImageIndex: effectiveLastImageIndex,
        maxSupportedImageIndex: MAX_SUPPORTED_IMAGE_INDEX,
      });
      setStartImageNumber(FIRST_IMAGE_SLOT.toString(10));
      setEndImageNumber(defaultEndImage.toString(10));
      setPreviewImageNumber(Math.min(defaultEndImage, MAX_SUPPORTED_IMAGE_INDEX));
      setPreviewStatus('Move the slider to preview a PicNRec slot.');
      setDialogOpen(true);
    } catch (error) {
      setError(error as Error);
    } finally {
      setDialogLoading(false);
    }
  }, [busy, dialogLoading, picNRec, setError]);

  useEffect(() => {
    if (!dialogOpen || !deviceInfo || !picNRec) {
      return;
    }

    previewTokenRef.current += 1;
    const token = previewTokenRef.current;

    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
    }

    setPreviewLoading(true);
    setPreviewStatus(`Previewing slot ${previewImageNumber}...`);

    previewTimeoutRef.current = window.setTimeout(async () => {
      try {
        const image = await picNRec.readImage(previewImageNumber);

        if (previewTokenRef.current !== token) {
          return;
        }

        setPreviewTiles(transformImage(image, 0, { allowBlank: true }));
        setPreviewStatus(`Preview loaded for slot ${previewImageNumber}.`);
      } catch (error) {
        if (previewTokenRef.current !== token) {
          return;
        }

        setPreviewTiles(null);
        setPreviewStatus(`Preview failed for slot ${previewImageNumber}: ${(error as Error).message}`);
      } finally {
        if (previewTokenRef.current === token) {
          setPreviewLoading(false);
        }
      }
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
    };
  }, [deviceInfo, dialogOpen, picNRec, previewImageNumber]);

  const importPicNRec = useCallback(async () => {
    if (!picNRec || !deviceInfo || busy || rangeError.length) {
      return;
    }

    const startImage = Number(startImageNumber);
    const endImage = Number(endImageNumber);
    const totalImages = endImage - startImage + 1;
    const imageNumbers = Array.from({ length: totalImages }, (_, index) => startImage + index);

    setBusy(true);
    closeImportDialog();
    const progressId = startProgress('Reading PicNRec images');

    try {
      const images: Uint8Array[] = [];

      for (const [index, imageNumber] of imageNumbers.entries()) {
        const image = await picNRec.readImage(imageNumber);

        if (isImportablePicNRecImage(image)) {
          images.push(image);
        }

        setProgress(progressId, (index + 1) / imageNumbers.length);
      }

      if (!images.length) {
        throw new Error('No importable PicNRec images were found in the selected range. Fully blank images are skipped.');
      }

      const syntheticSav = createPicNRecSav(images);
      const fileBytes = toFileBytes(syntheticSav);
      const importResult = await transformSav(new File([
        fileBytes,
      ], 'picnrec.sav', {
        type: 'application/octet-stream',
        lastModified: Date.now(),
      }), {
        skipDialogs: true,
      });

      sendEvent('importQueue', concatImportResults([importResult], 'picnrec'));
    } catch (error) {
      setError(error as Error);
    } finally {
      stopProgress(progressId);
      setBusy(false);
    }
  }, [busy, closeImportDialog, deviceInfo, endImageNumber, picNRec, rangeError.length, sendEvent, setError, setProgress, startImageNumber, startProgress, stopProgress]);

  const clearPicNRecLastImageLocation = useCallback(async () => {
    if (!picNRec || !deviceInfo || busy || dialogLoading) {
      return;
    }

    setDialog({
      message: 'Clear last PicNRec slot?',
      questions: () => ([
        {
          type: DialoqQuestionType.INFO,
          key: 'warning',
          label: 'This is a destructive action. It clears PicNRec\'s recorded last-image location by setting the last slot value to 0.',
          severity: 'warning',
        },
        {
          type: DialoqQuestionType.INFO,
          key: 'note',
          label: 'It does not erase the underlying slot payload data.',
          severity: 'info',
        },
      ]),
      confirm: async () => {
        dismissDialog(0);
        setBusy(true);

        try {
          await picNRec.clearLastImageLocation();
          const reportedLastImageNumber = await picNRec.readLastImageNumber();
          const effectiveLastImageIndex = getEffectiveLastImageIndex(reportedLastImageNumber);

          setDeviceInfo((current) => (current ? {
            ...current,
            imageCount: getEffectiveImageCount(reportedLastImageNumber),
            lastImageIndex: effectiveLastImageIndex,
          } : current));
          setPreviewStatus(`Cleared last-image location. Device now reports latest usable slot ${effectiveLastImageIndex}.`);
        } catch (error) {
          setError(error as Error);
        } finally {
          setBusy(false);
        }
      },
      deny: async () => dismissDialog(0),
    });
  }, [busy, deviceInfo, dialogLoading, dismissDialog, picNRec, setDialog, setError]);

  return {
    picNRecAvailable: Boolean(picNRec),
    openImportDialog,
    closeImportDialog,
    importPicNRec,
    clearPicNRecLastImageLocation,
    busy,
    dialogOpen,
    dialogLoading,
    deviceInfo,
    previewImageNumber,
    setPreviewImageNumber,
    previewTiles,
    previewStatus,
    previewLoading,
    startImageNumber,
    setStartImageNumber,
    endImageNumber,
    setEndImageNumber,
    rangeError,
    canImport,
  };
};
