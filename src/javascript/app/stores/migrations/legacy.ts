// eslint-disable-next-line no-console
import { migrateItems } from './history/0/migrateItems';

export const VERSION_LEGACY = -1;

export const migrateLegacy = async () => {
  // ToDo: change this to produce a version:0 and move migration to itemsStore
  // after these are resolved:
  // https://github.com/pmndrs/zustand/discussions/2827
  // https://github.com/pmndrs/zustand/pull/2833
  const oldState = localStorage.getItem('gbp-web-state');

  const newState = JSON.parse(localStorage.getItem('gbp-z-web-items') || '{"state":{}}');
  if (oldState) {
    const v1State = await migrateItems(JSON.parse(oldState));

    // force to pick oldImages on reload
    delete newState.state.images;

    const combinedState = {
      version: VERSION_LEGACY,
      state: {
        ...v1State,
        ...newState.state,
      },
    };

    localStorage.setItem('gbp-z-web-items', JSON.stringify(combinedState));
  }
};
