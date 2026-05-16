import { ExportFrameMode } from 'gb-image-decoder';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FileNameStyle } from '@/consts/fileNameStyles';
import useDownload from '@/hooks/useDownload';
import { useInteractionsStore, useItemsStore } from '@/stores/stores';
import { PrepareFilesOptions } from '@/tools/download';
import { getPaddingColor } from '@/tools/getPaddingColor';
import { imageDataToObjectURL } from '@/tools/imageDataToObjectURL';
import { audioBufferToWav, generateSamples, ModeType, samplesToAudioBuffer, type SSTVSettings } from '@/tools/sstv';

interface UseSSTV {
  modeType: ModeType;
  setModeType: Dispatch<SetStateAction<ModeType>>;
  silenceMs: string;
  setSilenceMs: Dispatch<SetStateAction<string>>;
  frameMode: ExportFrameMode;
  setFrameMode: Dispatch<SetStateAction<ExportFrameMode>>;
  audioSource: string;
  previewImageSource: string;
  previewImageWidth: number;
  filename: string;
  sstvSettings: SSTVSettings | null;
}

export const useSSTV = (): UseSSTV => {
  const { palettes, images } = useItemsStore();
  const [audioSource, setAudioSource] = useState<string>('');
  const [previewImageSource, setPreviewImageSource] = useState<string>('');
  const [previewImageWidth, setPreviewImageWidth] = useState<number>(0);
  const [filename, setFilename] = useState<string>('');
  const [sstvSettings, setSstvSettings] = useState<SSTVSettings | null>(null);
  const [modeType, setModeType] = useState<ModeType>(ModeType.MARTIN_2);
  const [frameMode, setFrameMode] = useState<ExportFrameMode>(ExportFrameMode.FRAMEMODE_KEEP);
  const [silenceMs, setSilenceMs] = useState<string>('0');
  const { prepareDownloadInfo } = useDownload();
  const { sstvHash } = useInteractionsStore();

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setPreviewImageSource((currentImageSource) => {
        URL.revokeObjectURL(currentImageSource);
        return '';
      });
      setPreviewImageWidth(0);
      setAudioSource((currentSource) => {
        URL.revokeObjectURL(currentSource);
        return '';
      });
      setFilename('');
      setSstvSettings(null);

      const sstvPrepareFilesOptions: PrepareFilesOptions = {
        exportScaleFactors: [1],
        exportFileTypes: ['png'],
        handleExportFrame: frameMode,
        palettes,
        fileNameStyle: FileNameStyle.TITLE_ONLY,
      };

      const paddingColor = getPaddingColor(images, palettes, sstvHash);

      const sampleRate = 48000;

      const [{ blob: pngBlob, filename: imageFilename }] = await prepareDownloadInfo(sstvHash, sstvPrepareFilesOptions);
      const { samples, settings, imageData } = await generateSamples(pngBlob, modeType, paddingColor);
      const audioBuffer = await samplesToAudioBuffer(sampleRate, samples, parseInt(silenceMs, 10) / 1000);

      if (imageData) {
        const previewImageUrl = await imageDataToObjectURL(imageData);
        setPreviewImageSource((currentImageSource) => {
          URL.revokeObjectURL(currentImageSource);
          return previewImageUrl;
        });
        setPreviewImageWidth(imageData.width);
      }

      if (audioBuffer) {
        const waveFile = audioBufferToWav(audioBuffer);
        setAudioSource((currentSource) => {
          URL.revokeObjectURL(currentSource);
          return URL.createObjectURL(waveFile);
        });
        setFilename(imageFilename.replace(/(\.[^.]+)$/, `_${modeType}.wav`));
        setSstvSettings(settings);
      }
    }, 1);

    return () => window.clearTimeout(handle);
  }, [frameMode, images, modeType, palettes, prepareDownloadInfo, silenceMs, sstvHash]);

  return {
    modeType,
    setModeType,
    silenceMs,
    setSilenceMs,
    frameMode,
    setFrameMode,
    audioSource,
    previewImageSource,
    previewImageWidth,
    filename,
    sstvSettings,
  };
};
