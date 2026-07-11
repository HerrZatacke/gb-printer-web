import predefinedPalettes from 'gb-palettes';
import { type Palette } from '@/types/Palette';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getPalettesByShortName = async (shortNames: string[]): Promise<ItemsSourceResponse<Palette>> => {
  const db = await getDb();
  const { store } = db.transaction('palettes');
  const total = await store.count();


  const palettes = await Promise.all(
    shortNames.map(async (shortName): Promise<Palette | null> => {
      const predefined = predefinedPalettes.find((pal) => (pal.shortName === shortName));
      if (predefined) {
        return {
          ...predefined,
          isPredefined: true,
        };
      }

      return (await store.get(shortName)) || null;
    }),
  );

  const filteredPalettes = palettes.filter((palette): palette is Palette => Boolean(palette));

  const addPaging = getAddPaging<Palette>(total, 0, palettes.length);

  return addPaging(filteredPalettes);
};

export const getPalettes = async (): Promise<ItemsSourceResponse<Palette>> => {
  const db = await getDb();
  const { store } = db.transaction('palettes');
  const palettes = await store.getAll();
  const total = await store.count() + predefinedPalettes.length;

  const withPredefined: Palette[] = [
    ...predefinedPalettes.map((palette): Palette => ({
      ...palette,
      isPredefined: true,
    })),
    ...palettes,
  ];

  const addPaging = getAddPaging<Palette>(total, 0, withPredefined.length);

  return addPaging(withPredefined);
};
