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
  {
    // Groups/Folders
    key: 'imageGroups',
    saveLocally: true,
    saveExport: [ExportTypes.REMOTE],
    value: [],
  },
  {
    // the imagegroup being edited currently
    key: 'editImageGroup',
    saveLocally: true,
    saveExport: [],
    value: null,
  },
  {
    // list of predefined palettes
    key: 'palettes',
    saveLocally: true,
    saveExport: [ExportTypes.PALETTES, ExportTypes.REMOTE],
    value: [],
  },
  {
    // list of plugins
    key: 'plugins',
    saveLocally: true,
    saveExport: [ExportTypes.SETTINGS, ExportTypes.REMOTE],
    value: [],
  },
  {
    // set of usable frames
    key: 'frames',
    saveLocally: true,
    saveExport: [ExportTypes.FRAMES, ExportTypes.REMOTE, ExportTypes.FRAMEGROUP],
    value: [],
  },
  {
    // set of usable frames
    key: 'frameGroupNames',
    saveLocally: true,
    saveExport: [ExportTypes.FRAMES, ExportTypes.REMOTE, ExportTypes.FRAMEGROUP],
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
