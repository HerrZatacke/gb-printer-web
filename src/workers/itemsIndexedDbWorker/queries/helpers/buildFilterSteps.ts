import { specialTags, SpecialTags } from '@/consts/SpecialTags';
import { Date } from '@/tools/safeDate';
import { toCreationDate } from '@/tools/toCreationDate';
import { Image } from '@/types/Image';
import {
  type FilterStep,
  type GetImagesFilters,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

export const buildFilterSteps = async (filters: GetImagesFilters, hostApi: ItemsHostApi): Promise<FilterStep[]> => {
  const { tags, palette, frame } = filters;
  const steps: FilterStep[] = [];

  const cleanTags = (tags || []).filter((tag) => !specialTags.includes(tag as SpecialTags));
  const usedSpecialTags = (tags || []).filter((tag): tag is SpecialTags => specialTags.includes(tag as SpecialTags));

  if (cleanTags?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'tags',
      values: cleanTags,
    });
  }

  if (palette?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'palette',
      values: palette,
    });
  }

  if (frame?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'frame',
      values: frame,
    });
  }


  for (const specialTag of usedSpecialTags) {
    switch (specialTag) {
      case SpecialTags.FILTER_UNTAGGED: {
        steps.push({
          kind: 'indexNone',
          indexName: 'tags',
        });
        break;
      }

      case SpecialTags.FILTER_NEW: {
        steps.push({
          kind: 'indexRange',
          indexName: 'created',
          range: IDBKeyRange.lowerBound(toCreationDate(Date.now() - 86400000), true),
        });
        break;
      }

      case SpecialTags.FILTER_MONOCHROME: {
        steps.push({
          kind: 'indexAny',
          indexName: 'type',
          values: ['mono'],
        });
        break;
      }

      case SpecialTags.FILTER_RGB: {
        steps.push({
          kind: 'indexAny',
          indexName: 'type',
          values: ['rgbn'],
        });
        break;
      }

      case SpecialTags.FILTER_RECENT: {
        const ids = await hostApi.getRecentImports();
        steps.push({
          kind: 'ids',
          ids,
        });
        break;
      }

      case SpecialTags.FILTER_FAVOURITE: {
        steps.push({
          kind: 'indexAny',
          indexName: 'tags',
          values: [SpecialTags.FILTER_FAVOURITE],
        });
        break;
      }

      case SpecialTags.FILTER_COMMENTS: {
        steps.push({
          kind: 'predicate',
          test: (image: Image) => Boolean(image.meta?.comment),
        });
        break;
      }

      case SpecialTags.FILTER_USERNAME: {
        steps.push({
          kind: 'predicate',
          test: (image: Image) => Boolean(image.meta?.userName),
        });
        break;
      }
    }
  }

  return steps;
};

