import type { ExportableState, State } from './State';
import { ExportTypes } from '../../consts/exportTypes';

export interface StorePropertyDefault {
  key: keyof State,
  saveLocally: boolean,
  saveExport: ExportTypes[],
  value: unknown,
}

export interface StorePropertyExportable extends Omit<StorePropertyDefault, 'key'> {
  key: keyof ExportableState,
}

const definitions: StorePropertyDefault[] = [
  {
    // Metadata of all images
    key: 'images',
    saveLocally: true,
    saveExport: [ExportTypes.SELECTED_IMAGES, ExportTypes.IMAGES, ExportTypes.REMOTE],
    value: [],
  },
];

const defaults: Partial<State> = {};
definitions.forEach(({ key, value }) => {
  Object.assign(defaults, { [key]: value });
});

export {
  defaults,
  definitions,
};
