import { type IDBPDatabase } from 'idb';
import { buildFilterSteps } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildFilterSteps';
import { intersectAll } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { getCandidates, resolveKeyableStep } from '@/workers/itemsIndexedDbWorker/queries/helpers/imagesKeyQueries';
import {
  type FilterStep,
  type ImageQueryFilters,
  type ItemsDB,
  type ItemsHostApi,
  type StoredImage,
} from '@/workers/itemsIndexedDbWorker/types';

export const resolveAndFilterImages = async (
  db: IDBPDatabase<ItemsDB>,
  hostApi: ItemsHostApi,
  filters?: ImageQueryFilters,
  seedIds?: Set<string>,
): Promise<StoredImage[]> => {
  const steps: FilterStep[] = await buildFilterSteps(filters || {}, hostApi);

  if (seedIds) {
    steps.push({ kind: 'ids', ids: seedIds });
  }

  const predicateSteps = steps.filter((s): s is Extract<FilterStep, { kind: 'predicate' }> => s.kind === 'predicate');

  let candidateIds: Set<string> | null = null;
  for (const step of steps) {
    if (step.kind === 'predicate') continue;
    const ids = await resolveKeyableStep(db as IDBPDatabase, step);
    candidateIds = candidateIds ? intersectAll([candidateIds, ids!]) as Set<string> : ids;
  }

  let images = await getCandidates(db, candidateIds);

  for (const step of predicateSteps) {
    images = images.filter(step.test);
  }
  return images;
};
