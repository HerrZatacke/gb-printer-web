import predefinedPalettes from 'gb-palettes';
import {
  type Palette,
  PaletteSchema,
  type DeletePalettesByShortNamesParams,
  type GetPalettesByShortNamesParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdatePalettesParams,
} from 'gb-printer-schemas';
import z from 'zod';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';


export const getPalettesByShortNames = async ({ shortNames }: GetPalettesByShortNamesParams): Promise<ItemsSourceResponse<Palette>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('palettes');
  const total = await store.count();


  const palettes = await Promise.all(
    shortNames
      .filter(Boolean)
      .map(async (shortName): Promise<Palette | null> => {
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

export const getPalettes = async (): Promise<ItemsSourceTotalResponse<Palette>> => {
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

  const addPaging = getAddTotal<Palette>(total, start, PaletteSchema);

  return addPaging(withPredefined);
};

export const updatePalettes = async ({ palettes, purge }: UpdatePalettesParams): Promise<void> => {
  const predefinedPaletteShortNames = new Set(predefinedPalettes.map(({ shortName }) => shortName));

  const filteredPalettes = palettes.filter(({ shortName }) => !predefinedPaletteShortNames.has(shortName));

  const parsedPalettes = z.array(PaletteSchema).parse(filteredPalettes);

  const db = await getDb();

  const tx = db.transaction('palettes', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedPalettes.map((palette) => store.put(palette)));
  await tx.done;
};

export const deletePalettesByShortNames = async ({ shortNames }: DeletePalettesByShortNamesParams): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('palettes', 'readwrite');
  const store = tx.store;

  await Promise.all(shortNames.map((shortName) => store.delete(shortName)));
  await tx.done;
};
