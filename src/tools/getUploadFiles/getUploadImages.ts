import { useItemsStore } from '@/stores/stores';
import { getTxtFile } from '@/tools/download/getTxtFile';
import { isRGBNImage } from '@/tools/isRGBNImage';
import unique from '@/tools/unique';
import type { RepoContents, RepoFile, SyncFile } from '@/types/Export';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';
import type { AddToQueueFn, DownloadInfo } from '@/types/Sync';

interface TmpInfo {
  file: Image,
  inRepo: RepoFile[],
  searchHashes: string[],
}

export const getUploadImages = async (
  repoContents: RepoContents,
  addToQueue: AddToQueueFn<SyncFile | null>,
): Promise<{
  syncImages: SyncFile[],
  missingLocally: string[],
}> => {
  const missingLocally: string[] = [];

  const { images: stateImages } = useItemsStore.getState();

  const images: TmpInfo[] = stateImages
    .map((image: Image): TmpInfo => {
      const searchHashes: string[] = isRGBNImage(image) ?
        unique(Object.values((image as RGBNImage).hashes)).filter(Boolean) : // filter removes undefined channels
        [image.hash];

      return {
        file: image,
        searchHashes,
        inRepo: repoContents.images.reduce((acc: RepoFile[], repoFile: RepoFile): RepoFile[] => (
          searchHashes.includes(repoFile.hash) ? [...acc, repoFile] : acc
        ), []),
      };
    });
  const imagesLength = images.length;

  const syncImages: (SyncFile | null)[] = await Promise.all(
    images.map(async (tmpInfo: TmpInfo, index: number): Promise<SyncFile | null> => {
      if (tmpInfo.inRepo.length === tmpInfo.searchHashes.length) {
        return {
          hash: tmpInfo.file.hash,
          inRepo: tmpInfo.inRepo,
          files: [],
        };
      }

      return (
        addToQueue(`loadImageTiles (${index + 1}/${imagesLength}) ${tmpInfo.file.title}`, 3, async (): Promise<SyncFile | null> => {

          let files: DownloadInfo[];

          if (isRGBNImage(tmpInfo.file)) {
            const rgbnImage = tmpInfo.file as RGBNImage;
            files = await Promise.all(Object.values((rgbnImage).hashes)
              .map((channelHash) => (
                getTxtFile(channelHash, rgbnImage.title, channelHash)
              )));
          } else {
            const monoImage = tmpInfo.file as MonochromeImage;
            files = [await getTxtFile(monoImage.hash, monoImage.title, monoImage.hash)];
          }

          return {
            hash: tmpInfo.file.hash, // string
            files, // DownloadInfo[]
            inRepo: tmpInfo.inRepo, // RepoFile[]
          };
        })
      );
    }),
  );

  return {
    syncImages: (syncImages.filter(Boolean) as SyncFile[]),
    missingLocally,
  };
};
