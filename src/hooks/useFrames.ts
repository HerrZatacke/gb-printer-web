import { useState, useEffect, useCallback } from 'react';
import type { ExportTypes } from '@/consts/exportTypes';
import { useStores } from '@/hooks/useStores';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { compressAndHashFrame, loadFrameData, saveFrameData } from '@/tools/applyFrame/frameData';
import { getFrameFromFullTiles } from '@/tools/getFrameFromFullTiles';
import getFrameGroups from '@/tools/getFrameGroups';
import { getFramesForGroup } from '@/tools/getFramesForGroup';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { padFrameData } from '@/tools/saveLocalStorageItems';
import { load } from '@/tools/storage';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import { Image } from '@/types/Image';
import { useImportExportSettings } from './useImportExportSettings';

const getValidFrameGroupId = (groups: FrameGroup[], byId: string): string => {
  const group = groups.find(({ id }) => id === byId);
  if (!group) {
    return groups[0]?.id || '';
  }

  return group.id;
};

interface UseFrames {
  selectedFrameGroup: string,
  groupFrames: Frame[],
  setSelectedFrameGroup: (id: string) => void,
  frameGroups: FrameGroup[],
  exportJson: (what: ExportTypes) => void,
  palette: string[],
  setActiveFrameGroupName: (name: string) => void,
  activeFrameGroup: FrameGroup,
  convertFormat: () => void,
  detectFrames: () => void,
  enableDebug: boolean,
}

const useFrames = (): UseFrames => {
  const { enableDebug, savFrameTypes, activePalette } = useSettingsStore();
  const { frames, images, palettes, frameGroups: frameGroupsState, addFrames, updateFrameGroups } = useItemsStore();
  const { updateLastSyncLocalNow, updateImages } = useStores();
  const { downloadSettings } = useImportExportSettings();

  const palette = palettes.find(({ shortName }) => shortName === activePalette) || palettes[0];

  const frameGroups = getFrameGroups(frames, frameGroupsState);
  const [groupFrames, setGroupFrames] = useState<Frame[]>([]);
  const [selectedFrameGroup, setSelectedFrameGroup] = useState(getValidFrameGroupId(frameGroups, savFrameTypes));

  useEffect(() => {
    if (selectedFrameGroup) {
      setGroupFrames(getFramesForGroup(frames, selectedFrameGroup));
    } else {
      setGroupFrames([]);
    }
  }, [frames, selectedFrameGroup]);

  useEffect(() => {
    if (selectedFrameGroup === '') {
      const possibleFrameGroup = getValidFrameGroupId(frameGroups, savFrameTypes);
      if (possibleFrameGroup !== '') {
        setSelectedFrameGroup(possibleFrameGroup);
      }
    }
  }, [frameGroups, frames, savFrameTypes, selectedFrameGroup]);

  const activeFrameGroup = frameGroups.find(({ id }) => (id === selectedFrameGroup)) || frameGroups[0];

  const setActiveFrameGroupName = (name: string) => {
    updateFrameGroups([{ ...activeFrameGroup, name }]);
    updateLastSyncLocalNow();
  };

  const exportJson = (what: ExportTypes) => downloadSettings(what, selectedFrameGroup);

  const convertFormat = useCallback(async () => {
    const updatedFrames = await Promise.all(frames.map(async (frame): Promise<Frame> => {
      const stateData = await loadFrameData(frame.hash);

      if (!stateData) {
        return frame;
      }

      const imageStartLine = stateData.upper.length / 20;
      const tileData = padFrameData(stateData);

      const { dataHash: newHash } = await compressAndHashFrame(tileData, imageStartLine);


      if (frame.hash === newHash) {
        return frame;
      }

      const saveHash = await saveFrameData(tileData, imageStartLine);

      return {
        ...frame,
        hash: saveHash,
      };
    }));

    addFrames(updatedFrames);
  }, [addFrames, frames]);

  const detectFrames = useCallback(async () => {
    const unframedImages = images
      .filter(({ frame }: Image) => !frame)
      .reduce(reduceImagesMonochrome, [])
    ;

    const updatedImages: Image[] = [];

    console.log(`found ${unframedImages.length} images without frame`);

    for (const image of unframedImages) {
      const tiles = await load(image.hash, undefined, true);

      if (!tiles || tiles.length !== 360) { continue; }

      const frameData = getFrameFromFullTiles(tiles, 2);
      const frameTileData = padFrameData(frameData);
      const { dataHash } = await compressAndHashFrame(frameTileData, 2);

      const frame = frames.find(({ hash }) => (hash === dataHash));

      if (!frame) {
        console.log(`unknown frame in image "${image.title}"`);
        continue;
      }


      updatedImages.push({
        ...image,
        frame: frame.id,
      });
    }

    console.log(`will update ${updatedImages.length} with correct frame`);
    updateImages(updatedImages);
  }, [frames, images, updateImages]);

  return {
    selectedFrameGroup,
    groupFrames,
    setSelectedFrameGroup,
    frameGroups,
    exportJson,
    palette: palette?.palette,
    setActiveFrameGroupName,
    activeFrameGroup,
    convertFormat,
    detectFrames,
    enableDebug,
  };
};

export default useFrames;
