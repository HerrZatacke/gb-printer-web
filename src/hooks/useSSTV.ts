import { saveAs } from 'file-saver';
import { ExportFrameMode } from 'gb-image-decoder';
import { useCallback, useState } from 'react';
import { FileNameStyle } from '@/consts/fileNameStyles';
import useDownload from '@/hooks/useDownload';
import { useItemsStore } from '@/stores/stores';
import { PrepareFilesOptions } from '@/tools/download';
import { generateSamples, audioBufferToWav, samplesToAudioBuffer, ModeType } from '@/tools/sstv';

interface UseSSTV {
  sstv: (hash: string) => Promise<void>;
  audioSource: string;
}

export const useSSTV = (): UseSSTV => {
  const { palettes } = useItemsStore();
  const [audioSource, setAudioSource] = useState<string>('');
  const { prepareDownloadInfo } = useDownload();

  const sstv = useCallback(async (hash: string) => {
    const sstvPrepareFilesOptions: PrepareFilesOptions = {
      exportScaleFactors: [1],
      exportFileTypes: ['png'],
      // handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
      handleExportFrame: ExportFrameMode.FRAMEMODE_CROP,
      palettes,
      fileNameStyle: FileNameStyle.TITLE_ONLY,
    };

    const sampleRate = 22500;

    const [{ blob: pngBlob }] = await prepareDownloadInfo(hash, sstvPrepareFilesOptions);
    // const samples = await generateSamples(pngBlob, ModeType.MARTIN_1);
    const samples = await generateSamples(pngBlob, ModeType.ROBOT_36);
    const audioBuffer = await samplesToAudioBuffer(sampleRate, samples);

    if (audioBuffer) {
      const waveBlob = audioBufferToWav(audioBuffer);
      saveAs(waveBlob, 'output.wav');
      // https://sstv-decoder.mathieurenaud.fr/

      setAudioSource((currentSource) => {
        URL.revokeObjectURL(currentSource);
        return URL.createObjectURL(waveBlob);
      });
    }

  }, [palettes, prepareDownloadInfo]);

  return {
    audioSource,
    sstv,
  };
};
