import predefinedPalettes from 'gb-palettes';
import z from 'zod';
import { type Palette, PaletteSchema } from '@/types/Palette';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getPalettesByShortNames = async (shortNames: string[]): Promise<ItemsSourceResponse<Palette>> => {
  const db = await getDb();
  const start = performance.now();

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

  const addPaging = getAddPaging<Palette>(total, 0, palettes.length, start, PaletteSchema);

  return addPaging(filteredPalettes);
};

export const getPalettes = async (): Promise<ItemsSourceResponse<Palette>> => {
  const db = await getDb();
  const start = performance.now();

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

  const addPaging = getAddPaging<Palette>(total, 0, withPredefined.length, start, PaletteSchema);

  return addPaging(withPredefined);
};

export const updatePalettes = async (palettes: Palette[]): Promise<void> => {
  const { success, data: parsedPalettes, error } = z.array(PaletteSchema).safeParse(palettes);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('palettes', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedPalettes.map((palette) => store.put(palette)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deletePalettesByShortNames = async (shortNames: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('palettes', 'readwrite');
  const store = tx.store;

  await Promise.all(shortNames.map((shortName) => store.delete(shortName)));
  await tx.done;
};
