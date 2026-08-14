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
  const { palettes: repository } = await getDb();
  const start = performance.now();

  const total = await repository.count();

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

        return (await repository.getByKey(shortName)) ?? null;
      }),
  );

  const filteredPalettes = palettes.filter((palette): palette is Palette => Boolean(palette));

  const addPaging = getAddPaging<Palette>(total, 0, palettes.length, start, PaletteSchema);

  return addPaging(filteredPalettes);
};

export const getPalettes = async (): Promise<ItemsSourceTotalResponse<Palette>> => {
  const { palettes: repository } = await getDb();
  const start = performance.now();

  const palettes = await repository.getAll();
  const total = await repository.count() + predefinedPalettes.length;

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

  const { palettes: repository } = await getDb();

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedPalettes.map((palette) => ({
      key: palette.shortName,
      value: palette,
    })),
  );
};

export const deletePalettesByShortNames = async ({ shortNames }: DeletePalettesByShortNamesParams): Promise<void> => {
  const { palettes: repository } = await getDb();
  await repository.deleteByKeys(shortNames);
};
