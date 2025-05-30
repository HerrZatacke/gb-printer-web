import type { ReadonlyURLSearchParams } from 'next/navigation';
import Queue from 'promise-queue';
import fetchDumpRetry from '@/tools/remote/fetchDumpRetry';
import type {
  PrinterImages,
  PrinterParams,
  BlobResponse,
  RemotePrinterEvent,
} from '@/types/Printer';

const queue = new Queue(1, Infinity);
const addToQueue = (
  fn: () => Promise<BlobResponse>,
  delay = 250,
) => {
  return (
    queue.add(async () => {
      await new Promise((resolve) => {
        window.setTimeout(resolve, delay);
      });

      return fn();
    })
  );
};

const fetchImages = async (
  targetWindow: Window,
  { dumps }: PrinterParams,
  remoteParams: ReadonlyURLSearchParams,
): Promise<PrinterImages> => {
  const delay = parseInt(remoteParams.get('delay') || '250', 10);
  const retries = parseInt(remoteParams.get('retries') || '3', 10);

  const awaitBlobs = dumps.map(async (dump: string, index: number): Promise<BlobResponse> => (
    addToQueue(
      async (): Promise<BlobResponse> => {
        try {
          const blobResponse: BlobResponse = await fetchDumpRetry(`/${dump.replace(/^\//, '')}`, retries);

          targetWindow.postMessage({
            fromRemotePrinter: {
              progress: (index + 1) / dumps.length,
            },
          } as RemotePrinterEvent, '*');

          return blobResponse;
        } catch (error) {
          console.warn(error);
          return {
            ok: false,
            blob: new Blob(),
          };
        }
      },
      delay,
    )
  ));

  return {
    blobsdone: await Promise.all(awaitBlobs),
  };
};

export default fetchImages;
