import predefinedPalettes from 'gb-palettes';
import {
  ItemStoreNames,
  PaletteSchema,
  type Palette,
  type DeletePalettesByShortNamesParams,
  type GetPalettesByShortNamesParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdatePalettesParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z from 'zod';
import { getAddPaging, getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';


export async function getPalettesByShortNames(this: ItemsSourceInternal, { shortNames }: GetPalettesByShortNamesParams): Promise<ItemsSourceResponse<Palette>> {
  const { palettes: repository } = this.repositories;
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
}

export async function getPalettes(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<Palette>> {
  const { palettes: repository } = this.repositories;
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
}

export async function updatePalettes(this: ItemsSourceInternal, { palettes, purge }: UpdatePalettesParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { palettes: repository } = this.repositories;
  const predefinedPaletteShortNames = new Set(predefinedPalettes.map(({ shortName }) => shortName));

  const filteredPalettes = palettes.filter(({ shortName }) => !predefinedPaletteShortNames.has(shortName));

  const parsedPalettes = z.array(PaletteSchema).parse(filteredPalettes);

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedPalettes.map((palette) => ({
      key: palette.shortName,
      value: palette,
    })),
  );
  return mutationReponse([{ collection: ItemStoreNames.PALETTES }]);
}

export async function deletePalettesByShortNames(this: ItemsSourceInternal, { shortNames }: DeletePalettesByShortNamesParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { palettes: repository } = this.repositories;
  await repository.deleteByKeys(shortNames);
  return mutationReponse([{ collection: ItemStoreNames.PALETTES }]);
}
