import { ExportFrameMode } from 'gb-image-decoder';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FileNameStyle } from '@/consts/fileNameStyles';
import useDownload from '@/hooks/useDownload';
import { useInteractionsStore, useItemsStore } from '@/stores/stores';
import { PrepareFilesOptions } from '@/tools/download';
import { audioBufferToWav, generateSamples, ModeType, samplesToAudioBuffer, type SSTVSettings } from '@/tools/sstv';

interface UseSSTV {
  modeType: ModeType;
  setModeType: Dispatch<SetStateAction<ModeType>>;
  silenceMs: string;
  setSilenceMs: Dispatch<SetStateAction<string>>;
  audioSource: string;
  filename: string;
  sstvSettings: SSTVSettings | null;
}

export const useSSTV = (): UseSSTV => {
  const { palettes } = useItemsStore();
  const [audioSource, setAudioSource] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [sstvSettings, setSstvSettings] = useState<SSTVSettings | null>(null);
  const [modeType, setModeType] = useState<ModeType>(ModeType.MARTIN_1);
  const [silenceMs, setSilenceMs] = useState<string>('0');
  const { prepareDownloadInfo } = useDownload();
  const { sstvHash } = useInteractionsStore();

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setAudioSource((currentSource) => {
        URL.revokeObjectURL(currentSource);
        return '';
      });
      setFilename('');
      setSstvSettings(null);

      const sstvPrepareFilesOptions: PrepareFilesOptions = {
        exportScaleFactors: [1],
        exportFileTypes: ['png'],
        // handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
        handleExportFrame: ExportFrameMode.FRAMEMODE_CROP,
        palettes,
        fileNameStyle: FileNameStyle.TITLE_ONLY,
      };

      const sampleRate = 48000;

      const [{ blob: pngBlob, filename: imageFilename }] = await prepareDownloadInfo(sstvHash, sstvPrepareFilesOptions);
      const { samples, settings } = await generateSamples(pngBlob, modeType);
      const audioBuffer = await samplesToAudioBuffer(sampleRate, samples, parseInt(silenceMs, 10) / 1000);

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
  }, [modeType, palettes, prepareDownloadInfo, silenceMs, sstvHash]);

  return {
    modeType,
    setModeType,
    silenceMs,
    setSilenceMs,
    audioSource,
    filename,
    sstvSettings,
  };
};
