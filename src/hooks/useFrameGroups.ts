import { useMemo } from 'react';
import { useItemsStore } from '@/stores/stores';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';

const getGroupName = (id: string, name: string, frameGroupNames: FrameGroup[]): string => {
  const namedGroup = frameGroupNames.find((group) => (group.id === id));
  if (namedGroup) {
    return namedGroup.name;
  }

  switch (id) {
    case 'hk':
      return 'Hallo Katze!';
    case 'int':
      return 'International Frames (GameBoy Camera)';
    case 'jp':
      return 'Japanese Frames (Pocket Camera)';
    default:
      return name;
  }
};

const prioId = (id: string): string => {
  switch (id) {
    case 'int':
      return '_1';
    case 'jp':
      return '_2';
    case 'hk':
      return '_3';
    default:
      return id;
  }
};

// Raw function needs to be exported for settings-export and tansformSav, which are not react hooks.
export const getFrameGroups = (frames: Frame[], frameGroupNames: FrameGroup[]): FrameGroup[] => {
  const usedGroups: FrameGroup[] = frames
    .reduce((result: FrameGroup[], { id, name }): FrameGroup[] => {
      try {
        const groupId = id.match(/^[a-z]+/g)?.[0];
        if (!groupId) {
          return result;
        }

        if (!result.find((group) => group.id === groupId)) {
          result.push({
            id: groupId,
            name: getGroupName(groupId, name, frameGroupNames),
          });
        }

        return result;
      } catch {
        return result;
      }
    }, []);

  return usedGroups
    .sort(({ id: ida }, { id: idb }) => {
      const sorta = prioId(ida);
      const sortb = prioId(idb);

      if (sorta > sortb) {
        return 1;
      }

      if (sorta < sortb) {
        return -1;
      }

      return 0;
    });
};

export interface UseFrameGroups {
  frameGroups: FrameGroup[];
}

export const useFrameGroups = (): UseFrameGroups => {
  const { frameGroups: frameGroupsState, frames } = useItemsStore();
  const frameGroups = useMemo(() => {
    return getFrameGroups(frames, frameGroupsState);
  }, [frameGroupsState, frames]);

  return {
    frameGroups,
  };
};
