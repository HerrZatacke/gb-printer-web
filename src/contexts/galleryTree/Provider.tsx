'use client';

import React, { type Context, createContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useGalleryParams } from '@/hooks/useGalleryParams';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { createTreeRoot } from '@/tools/createTreeRoot';
import { type DialogOption } from '@/types/Dialog';
import {
  type CalculateRootWorkerParams,
  type CalculateRootWorkerError,
  type CalculateRootWorkerResult,
  type GalleryTreeContextType,
  type PathMap,
} from '@/types/galleryTreeContext';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';

export const galleryTreeContext: Context<GalleryTreeContextType> = createContext<GalleryTreeContextType>({
  root: createTreeRoot(),
  view: createTreeRoot(),
  images: [],
  covers: [],
  paths: [],
  pathsOptions: [],
  isWorking: false,
});


export function GalleryTreeContext({ children }: PropsWithChildren) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [root, setRoot] = useState<TreeImageGroup>(createTreeRoot());
  const [paths, setPaths] = useState<PathMap[]>([]);
  const [pathsOptions, setPathsOptions] = useState<DialogOption[]>([]);

  const { enableImageGroups, enableDebug } = useSettingsStore();
  const { setError } = useInteractionsStore();
  const { imageGroups: stateImageGroups, images: stateImages, setImageGroups } = useItemsStore();

  const imageGroups = useMemo<SerializableImageGroup[]>(
    () => (enableImageGroups ? stateImageGroups : []),
    [enableImageGroups, stateImageGroups],
  );

  const { path } = useGalleryParams();

  useEffect(() => {
    const newWorker = new Worker(new URL('@/workers/treeContextWorker', import.meta.url));

    newWorker.onmessage = (event: MessageEvent<CalculateRootWorkerResult | CalculateRootWorkerError>) => {
      if (event.data.type === 'result') {
        setRoot(event.data.root);
        setPaths(event.data.paths);
        setPathsOptions(event.data.pathsOptions);
        setIsWorking(false);

        if (stateImageGroups.length > event.data.paths.length) {
          const idsInPaths = event.data.paths.map(({ group }) => group.id);
          const usedGroups = stateImageGroups.filter(({ id }) => (idsInPaths.includes(id)));
          setImageGroups(usedGroups);
        }

        if (enableDebug) {
          console.info(`worker ran for ${event.data.duration}ms`);
        }
      } else if (event.data.type === 'error') {
        setError(new Error(event.data.error));
      }
    };

    newWorker.onerror = (event) => {
      setError(new Error(event.message));
      setIsWorking(false);
    };

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
      setWorker(null);
    };
  }, [enableDebug, setError, setImageGroups, stateImageGroups]);

  useEffect(() => {
    if (!worker) {
      return;
    }

    setIsWorking(true);
    worker.postMessage({ imageGroups, stateImages } as CalculateRootWorkerParams);
  }, [imageGroups, stateImages, worker]);


  const result = useMemo<GalleryTreeContextType>((): GalleryTreeContextType => {
    const view = paths.find(({ absolutePath }) => absolutePath === path)?.group || root;
    const covers = view.groups.map(({ coverImage }) => coverImage);
    const images = view.images.filter((image: Image) => !covers.includes(image.hash));

    return { view, covers, paths, images, pathsOptions, root, isWorking };
  }, [path, paths, pathsOptions, root, isWorking]);

  return (
    <galleryTreeContext.Provider value={result}>
      { children }
    </galleryTreeContext.Provider>
  );
}

