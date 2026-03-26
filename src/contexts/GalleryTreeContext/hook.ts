import { proxy, wrap } from 'comlink';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUrl } from '@/hooks/useUrl';
import {
  useInteractionsStore,
  useItemsStore,
  useSettingsStore,
} from '@/stores/stores';
import { createTreeRoot } from '@/tools/createTreeRoot';
import { type DialogOption } from '@/types/Dialog';
import {
  type GetUrlParams,
  type GalleryTreeContextType,
  type PathMap,
  type SetErrorFn,
  type TreeContextWorkerApi,
} from '@/types/galleryTreeContext';
import { type Image } from '@/types/Image';
import { TreeImageGroup } from '@/types/ImageGroup';

const GALLERY_BASE_PATH = '/gallery/';

export const useContextHook = (): GalleryTreeContextType => {
  const { imageGroups, images: stateImages, setImageGroups, initialized: itemsStoreInitialized } = useItemsStore();
  const [isWorking, setIsWorking] = useState<boolean>(true); // start as isWorking=true to prevent premature effects triggering
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // start asto prevent navigation side effect
  const [root, setRoot] = useState<TreeImageGroup>(createTreeRoot(stateImages));
  const [paths, setPaths] = useState<PathMap[]>([]);
  const [pathsOptions, setPathsOptions] = useState<DialogOption[]>([]);
  const { searchParams, pathname } = useUrl();
  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  const { enableDebug } = useSettingsStore();
  const { setError } = useInteractionsStore();

  useEffect(() => {
    const worker = new Worker(new URL('@/workers/treeContextWorker', import.meta.url), { type: 'module' });
    const api = wrap<TreeContextWorkerApi>(worker);
    const errors: string[] = [];

    const setErrorProxy = proxy<SetErrorFn>((error: string) => {
      errors.push(error);
    });

    const handle = window.setTimeout(async () => {
      if (!itemsStoreInitialized) {
        return;
      }

      setIsWorking(true);

      const workerResult = await api.calculate({ imageGroups, stateImages }, setErrorProxy);

      try {
        setRoot(workerResult.root);
        setPaths(workerResult.paths);
        setPathsOptions(workerResult.pathsOptions);

        if (errors.length) {
          setError(new Error(errors.join('\n')));
        }

        if (imageGroups.length > workerResult.paths.length) {
          const idsInPaths = workerResult.paths.map(({ group }) => group.id);
          const usedGroups = imageGroups.filter(({ id }) => (idsInPaths.includes(id)));
          setImageGroups(usedGroups);
        }

        if (enableDebug) {
          console.info(`worker ran for ${workerResult.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.error(error);
        setError(error as Error);
      } finally {
        setIsWorking(false);
        setIsInitialized(true);
        worker.terminate();
      }
    }, 1);

    return () => {
      clearTimeout(handle);
      worker.terminate();
      setIsWorking(false);
    };
  }, [enableDebug, imageGroups, itemsStoreInitialized, setError, setImageGroups, stateImages]);

  const pageIndex = useMemo(() => (
    parseInt(searchParams.get('page') ?? '1', 10) - 1
  ), [searchParams]);

  const path = useMemo(() => (searchParams.get('group') || ''), [searchParams]);

  const getUrl = useCallback((params: GetUrlParams) => {
    const page: number = typeof params.pageIndex === 'number' ? params.pageIndex : pageIndex;
    const group: string = typeof params.group === 'string' ? params.group : path;

    let link = `${GALLERY_BASE_PATH}?page=${page + 1}`;
    if (group.length) {
      link = `${link}&group=${encodeURIComponent(group)}`;
    }

    return link;
  }, [pageIndex, path]);

  useEffect(() => {
    if (pathname === GALLERY_BASE_PATH) {
      const handle = window.setTimeout(() => {
        const link = getUrl({ pageIndex , group: path });
        setLastGalleryLink(link);
      }, 1);

      return () => window.clearTimeout(handle);
    }

    return () => {/**/};
  }, [path, pageIndex, pathname, getUrl]);


  const view = useMemo(() => (
    paths.find(({ absolutePath }) => absolutePath === path)?.group || root
  ), [path, paths, root]);

  const covers = useMemo(() => (
    view.groups.map(({ coverImage }) => coverImage)
  ), [view.groups]);

  const images = useMemo(() => (
    view.images.filter((image: Image) => !covers.includes(image.hash))
  ), [covers, view.images]);

  return {
    view,
    covers,
    paths,
    images,
    pathsOptions,
    root,
    isWorking,
    isInitialized,
    pageIndex,
    path,
    lastGalleryLink,
    getUrl,
  };
};
