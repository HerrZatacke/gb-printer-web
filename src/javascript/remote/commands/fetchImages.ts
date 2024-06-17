import Queue from 'promise-queue';
import fetchDumpRetry from '../fetchDumpRetry';
import type {
  PrinterImages,
  PrinterParams,
  BlobResponse,
  RemotePrinterParams, RemotePrinterEvent,
} from '../../../types/Printer';

const queue = new Queue(1, Infinity);
const addToQueue = (
  fn: () => Promise<BlobResponse>,
  { delay = 250 }: RemotePrinterParams,
) => (
  queue.add(async () => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, delay);
    });

    return fn();
  })
);

const fetchImages = async (
  targetWindow: Window,
  { dumps }: PrinterParams,
  remoteParams: RemotePrinterParams,
): Promise<PrinterImages> => {
  const queueOptions = { delay: remoteParams.delay };

  const awaitBlobs = dumps.map(async (dump: string, index: number): Promise<BlobResponse> => (
    addToQueue(
      async (): Promise<BlobResponse> => {
        try {
          const blobResponse: BlobResponse = await fetchDumpRetry(`/${dump.replace(/^\//, '')}`, 3);

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
          };
        }
      },
      queueOptions,
    )
  ));

  return {
    blobsdone: await Promise.all(awaitBlobs),
  };
};

export default fetchImages;
