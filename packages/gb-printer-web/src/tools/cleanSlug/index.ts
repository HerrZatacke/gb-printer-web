import { cleanDoubleSlashes, withLeadingSlash, withoutTrailingSlash } from 'ufo';

export const cleanSlug = (slug: string): string => {
  return slug.replace(/[^A-Z0-9_-]+/gi, '_');
};

export const cleanFullSlug = (slug: string): string => {
  return cleanDoubleSlashes(withLeadingSlash(withoutTrailingSlash(slug)));
};
