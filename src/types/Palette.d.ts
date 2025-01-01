import type { GbPalette } from 'gb-palettes';

/*
* On Type-Changes, a history for migration must be kept in /src/javascript/app/stores/migrations/history/
* */
export interface Palette extends GbPalette {
  isPredefined: boolean,
}
