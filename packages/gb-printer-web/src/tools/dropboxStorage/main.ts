import { Date } from 'gb-printer-schemas';
import Queue from 'promise-queue';
import { SyncDirection } from '@/consts/sync';
import { getQueryClient } from '@/contexts/QueryClient';
import { type UseStores } from '@/hooks/useStores';
import { framesByIdsQueryOptions } from '@/stores/items/queries/frames';
import { globalStatsQueryOptions } from '@/stores/items/queries/global';
import { imagesRawQueryOptions } from '@/stores/items/queries/images';
import {
  LogType,
  useFiltersStore,
  useInteractionsStore,
  useProgressStore,
  useSettingsStore,
  useStoragesStore,
} from '@/stores/stores';
import { delay } from '@/tools/delay';
import { prepareFiles, type PrepareFilesOptions } from '@/tools/download';
import getUploadFiles from '@/tools/getUploadFiles';
import { loadImageTiles } from '@/tools/loadImageTiles';
import parseAuthParams from '@/tools/parseAuthParams';
import replaceDuplicateFilenames from '@/tools/replaceDuplicateFilenames';
import { saveLocalStorageItems } from '@/tools/saveLocalStorageItems';
import { DownloadArrayBuffer } from '@/types/download';
import { type RepoContents } from '@/types/Export';
import { type JSONExport } from '@/types/ExportState';
import { type AddToQueueFn, type DBFolderFile, type DownloadInfo, type DropBoxSettings, type UploadFile } from '@/types/Sync';
import { type ImageSortField, type SortDirection } from '@/workers/itemsIndexedDbWorker/schemas';
import { loadFrameData } from '../applyFrame/frameData';
import DropboxClient from './DropboxClient';
import { hasher } from './DropboxClient/dropboxContentHasher';
import { type DropBoxSyncTool } from './index';

interface WithContentHash {
  dropboxContentHash: string;
}

export const dropBoxSyncTool = (
  stores: UseStores,
  remoteImport: (repoContents: JSONExport) => Promise<void>,
): DropBoxSyncTool => {
  const queryClient = getQueryClient();
  const { setSyncBusy, setSyncSelect, setError } = useInteractionsStore.getState();
  const { setProgressLog } = useProgressStore.getState();

  const queue = new Queue(1, Infinity);
  const addToQueue = (who: string): AddToQueueFn<unknown> => (
    what: string,
    throttle: number,
    fn: () => Promise<unknown>,
    isSilent?: boolean,
  ) => (
    queue.add(async () => {
      await delay(throttle);
      if (!isSilent) {
        setProgressLog('dropbox', {
          timestamp: (new Date()).getTime() / 1000,
          message: `${who} runs ${what}`,
          type: LogType.MESSAGE,
        });
      }

      return fn();
    })
  );

  const dropboxClient = new DropboxClient(useStoragesStore.getState().dropboxStorage, addToQueue('Dropbox'));

  const updateSettings = async (dropBoxSettings: DropBoxSettings) => {
    dropboxClient.setRootPath(dropBoxSettings.path || '/');
  };

  const startSyncData = async (direction: SyncDirection) => {
    setSyncBusy(true);
    setSyncSelect(false);

    try {
      const { syncLastUpdate } = useStoragesStore.getState();
      const repoContents: RepoContents = await dropboxClient.getRemoteContents();

      switch (direction) {
        case SyncDirection.UP: {
          const lastUpdateUTC = syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
          const changes = await getUploadFiles(repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
          await dropboxClient.upload(changes, 'settings');
          useStoragesStore.getState().setSyncLastUpdate('dropbox', lastUpdateUTC);
          break;
        }

        case SyncDirection.DOWN: {
          const syncedState = await saveLocalStorageItems(repoContents);
          await remoteImport(syncedState);

          const lastUpdate = repoContents.settings?.state?.lastUpdateUTC || 0;
          if (lastUpdate) {
            useStoragesStore.getState().setSyncLastUpdate('dropbox', lastUpdate);

            // Local time is set in useStores->combinedGlobalUpdate
            // useStoragesStore.getState().setSyncLastUpdate('local', lastUpdate);
          }

          break;
        }

        default:
          throw new Error('dropbox sync: wrong sync case');
      }
    } catch (error) {
      setProgressLog('dropbox', {
        timestamp: (new Date()).getTime() / 1000,
        message: `Encountered an error during sync: ${(error as Error).message}`,
        type: LogType.ERROR,
      });
    }

    setProgressLog('dropbox', {
      timestamp: (new Date()).getTime() / 1000,
      message: '.',
      type: LogType.DONE,
    });

    setSyncBusy(false);
  };


  const startSyncImages = async () => {
    setSyncBusy(true);
    setSyncSelect(false);

    // const { items: stateImages } = await queryClient.fetchQuery(imagesListQueryOptions());
    const { filtersTags, filtersPalettes, filtersFrames, sortBy } = useFiltersStore.getState();
    const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle } = useSettingsStore.getState();

    const [sortField, direction] = sortBy.split('_');

    const { totals: { images: totalImages } } = await queryClient.fetchQuery(globalStatsQueryOptions());

    if (totalImages > 500) {
      setSyncBusy(false);
      setError(new Error('Cancelled - Syncing more than 500 images to dropbox is most likely to fail'));
      return;
    }

    const { items: images } = await queryClient.fetchQuery(imagesRawQueryOptions({
      page: 0,
      pageSize: totalImages,
      filters: {
        tags: filtersTags,
        palette: filtersPalettes,
        frame: filtersFrames,
      },
      sort: {
        field: sortField as ImageSortField,
        direction: direction as SortDirection,
      },
    }));

    const prepareFilesOptions: PrepareFilesOptions ={
      exportScaleFactors,
      exportFileTypes,
      handleExportFrame,
      fileNameStyle,
    };
    const loadTiles = loadImageTiles();

    const downloadInfos = (await Promise.all(
      images.map(async (image, index): Promise<unknown> => (
        addToQueue('Generate images and hashes')(`${index + 1}/${images.length}`, 10, async () => {
          const tiles = await loadTiles(image.hash);

          const { items: [frame] } = await queryClient.fetchQuery(framesByIdsQueryOptions(image.frame ? [image.frame] : []));
          const frameData = frame ? await loadFrameData(frame?.hash) : null;
          const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

          if (!tiles) {
            throw new Error('tiles missing');
          }

          const imageBlobs = await prepareFiles(image, tiles, imageStartLine, prepareFilesOptions);

          const result = await Promise.all(
            imageBlobs.map(async (dlInfo: DownloadInfo): Promise<DownloadArrayBuffer> => ({
              filename: dlInfo.filename,
              arrayBuffer: await dlInfo.blob.arrayBuffer(),
            })),
          );
          return result;
        })
      )),
    )).flat() as DownloadArrayBuffer[];


    const cleanedFilenames = replaceDuplicateFilenames(downloadInfos);

    const hashedImages = await Promise.all(
      cleanedFilenames.map(async (img): Promise<DownloadArrayBuffer & WithContentHash> => ({
        ...img,
        dropboxContentHash: await hasher(img.arrayBuffer),
      })),
    );

    const remoteContents: DBFolderFile[] = await dropboxClient.getImageContents();

    const toUpload = hashedImages
      .reduce((acc: UploadFile[], image: DownloadArrayBuffer & WithContentHash): UploadFile[] => {
        const { arrayBuffer, dropboxContentHash, filename } = image;
        if (remoteContents.findIndex(({ content_hash: contentHash, name }: DBFolderFile) => (
          (contentHash === dropboxContentHash) &&
          (name === filename)
        )) === -1) { // image not found in Dropbox list
          return [...acc, {
            blob: new Blob([arrayBuffer]),
            destination: filename,
          }];
        }

        return acc;
      }, []);

    await dropboxClient.upload({ upload: toUpload, del: [] }, 'images');
    setProgressLog('dropbox', {
      timestamp: (new Date()).getTime() / 1000,
      message: '.',
      type: LogType.DONE,
    });

    setSyncBusy(false);
  };

  dropboxClient.on('loginDataUpdate', (data) => {
    const { setDropboxStorage } = useStoragesStore.getState();
    setDropboxStorage(data);
  });

  const { dropboxCode } = parseAuthParams();
  if (dropboxCode) {
    dropboxClient.codeAuth(dropboxCode);
  }

  useStoragesStore.subscribe((state) => state.dropboxStorage, updateSettings);

  return {
    updateSettings,
    startSyncData,
    startSyncImages,
    startAuth: () => dropboxClient.startAuth(),
  };
};
