import type { ItemsState } from '../../../itemsStore';
import type { ReduxState } from './State';
import hashFrames from '../../../../../tools/cleanState/hashFrames';

export const migrateItems = async (persistedState: unknown): Promise<Partial<ItemsState>> => {
  const v0state = persistedState as Partial<ReduxState>;
  const result: Partial<ItemsState> = {};

  if (v0state.frames?.length) {
    result.frames = await hashFrames(v0state.frames);
  }

  if (v0state.palettes?.length) {
    result.palettes = v0state.palettes;
  }

  return result;
};
