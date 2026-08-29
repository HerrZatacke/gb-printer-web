import { ItemsMutationReponse } from 'gb-printer-schemas';

export const isMutationResult = (result: unknown): result is ItemsMutationReponse => {
  return typeof result === 'object' && result !== null && Array.isArray((result as { invalidations: unknown }).invalidations);
};
