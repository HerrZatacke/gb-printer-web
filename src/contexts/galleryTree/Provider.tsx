'use client';

import { proxy, wrap } from 'comlink';
import React, { type Context, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useUrl } from '@/hooks/useUrl';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { createTreeRoot } from '@/tools/createTreeRoot';
import { type DialogOption } from '@/types/Dialog';
import {
  GetUrlParams,
  type GalleryTreeContextType,
  type PathMap,
  type SetErrorFn,
  type TreeContextWorkerApi,
} from '@/types/galleryTreeContext';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';

const GALLERY_BASE_PATH = '/gallery/';

export const galleryTreeContext: Context<GalleryTreeContextType> = createContext<GalleryTreeContextType>({
  root: createTreeRoot(),
  view: createTreeRoot(),
  images: [],
  covers: [],
  paths: [],
  pathsOptions: [],
  isWorking: false,
  pageIndex: 0,
  path: '',
  lastGalleryLink: '',
  getUrl: () => `${GALLERY_BASE_PATH}?page=1`,
});


export function GalleryTreeContext({ children }: PropsWithChildren) {
  const [isWorking, setIsWorking] = useState<boolean>(true); // start as isWorking=true to prevent premature effects triggering
  const [root, setRoot] = useState<TreeImageGroup>(createTreeRoot());
  const [paths, setPaths] = useState<PathMap[]>([]);
  const [pathsOptions, setPathsOptions] = useState<DialogOption[]>([]);
  const { searchParams, pathname } = useUrl();
  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  const { enableImageGroups, enableDebug } = useSettingsStore();
  const { setError } = useInteractionsStore();
  const { imageGroups: stateImageGroups, images: stateImages, setImageGroups } = useItemsStore();

  const imageGroups = useMemo<SerializableImageGroup[]>(
    () => (enableImageGroups ? stateImageGroups : []),
    [enableImageGroups, stateImageGroups],
  );

  useEffect(() => {
    const worker = new Worker(new URL('@/workers/treeContextWorker', import.meta.url), { type: 'module' });
    const api = wrap<TreeContextWorkerApi>(worker);
    const errors: string[] = [];

    const setErrorProxy = proxy<SetErrorFn>((error: string) => {
      errors.push(error);
    });

    setIsWorking(true);

    api.calculate({ imageGroups, stateImages }, setErrorProxy)
      .then((result) => {
        setRoot(result.root);
        setPaths(result.paths);
        setPathsOptions(result.pathsOptions);

        if (errors.length) {
          setError(new Error(errors.join('\n')));
        }

        if (enableImageGroups) {
          console.log(1, stateImageGroups.length, result.paths.length);
          if (stateImageGroups.length > result.paths.length) {
            console.log(2);
            const idsInPaths = result.paths.map(({ group }) => group.id);
            const usedGroups = stateImageGroups.filter(({ id }) => (idsInPaths.includes(id)));
            setImageGroups(usedGroups);
          }
        }

        if (enableDebug) {
          console.info(`worker ran for ${result.duration.toFixed(2)}ms`);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsWorking(false);
        worker.terminate();
      });

    return () => {
      worker.terminate();
      setIsWorking(false);
    };
  }, [enableDebug, enableImageGroups, imageGroups, setError, setImageGroups, stateImageGroups, stateImages]);

  const pageIndex = useMemo(() => (
    parseInt(searchParams.get('page') ?? '1', 10) - 1
  ), [searchParams]);

  const path = useMemo(() => (searchParams.get('group') || ''), [searchParams]);

  const getUrl = useCallback((params: GetUrlParams) => {
    const page: number = typeof params.pageIndex === 'number' ? params.pageIndex : pageIndex;
    const group: string = typeof params.group === 'string' ? params.group : path;

    let link = `${GALLERY_BASE_PATH}?page=${page + 1}`;
    if (group.length) {
      link = `${link}&group=${group}`;
    }

    return link;
  }, [pageIndex, path]);

  useEffect(() => {
    if (pathname === GALLERY_BASE_PATH) {
      const link = getUrl({ pageIndex , group: path });
      setLastGalleryLink(link);
    }
  }, [path, pageIndex, pathname, getUrl]);


  const result = useMemo<GalleryTreeContextType>((): GalleryTreeContextType => {
    const view = paths.find(({ absolutePath }) => absolutePath === path)?.group || root;
    const covers = view.groups.map(({ coverImage }) => coverImage);
    const images = view.images.filter((image: Image) => !covers.includes(image.hash));

    return {
      view,
      covers,
      paths,
      images,
      pathsOptions,
      root,
      isWorking,
      pageIndex,
      path,
      lastGalleryLink,
      getUrl,
    };
  }, [paths, root, pathsOptions, isWorking, pageIndex, path, lastGalleryLink, getUrl]);

  return (
    <galleryTreeContext.Provider value={result}>
      { children }
    </galleryTreeContext.Provider>
  );
}

