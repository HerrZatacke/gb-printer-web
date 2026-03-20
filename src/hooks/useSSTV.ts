import { saveAs } from 'file-saver';
import { ExportFrameMode } from 'gb-image-decoder';
import { useCallback } from 'react';
import { FileNameStyle } from '@/consts/fileNameStyles';
import useDownload from '@/hooks/useDownload';
import { useItemsStore } from '@/stores/stores';
import { PrepareFilesOptions } from '@/tools/download';
import { generateFrequencies } from '@/tools/sstv';
import { ModeType } from '@/tools/sstv/types';

interface UseSSTV {
  sstv: (hash: string) => Promise<void>;
}

export const useSSTV = (): UseSSTV => {
  const { palettes } = useItemsStore();
  const { prepareDownloadInfo } = useDownload();

  const sstv = useCallback(async (hash: string) => {
    const waveBlob: Blob = await (new Promise(async (resolve) => {

      const sstvPrepareFilesOptions: PrepareFilesOptions = {
        exportScaleFactors: [1],
        exportFileTypes: ['png'],
        handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
        palettes,
        fileNameStyle: FileNameStyle.TITLE_ONLY,
      };

      const [{ blob: pngBlob }] = await prepareDownloadInfo(hash, sstvPrepareFilesOptions);

      // const frequencies = await generateFrequencies(pngBlob, ModeType.MARTIN_1);
      const frequencies = await generateFrequencies(pngBlob, ModeType.ROBOT_36);

      const audioCtx = new window.AudioContext();

      if (!audioCtx) {
        return;
      }

      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.1; // keep volume low

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const dest = audioCtx.createMediaStreamDestination();
      oscillator.connect(dest);

      const recorder = new MediaRecorder(dest.stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' }); // audio/webm audio/mp3
        resolve(blob);
      };

      recorder.start();
      oscillator.onended = () => recorder.stop();



      let t = audioCtx.currentTime;
      console.log('start');
      oscillator.start();
      frequencies.forEach(({ freq, durationMs }) => {
        oscillator.frequency.setValueAtTime(freq, t);
        t += durationMs / 1000;
      });
      oscillator.stop(t);
      console.log('stop');
    }));

    saveAs(waveBlob, 'output.mp3');
    // https://sstv-decoder.mathieurenaud.fr/

  }, [palettes, prepareDownloadInfo]);

  return { sstv };
};
