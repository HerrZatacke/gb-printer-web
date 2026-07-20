import { createDialogsStore } from './dialogsStore';
import { createEditStore } from './editStore';
import { createFiltersStore } from './filtersStore';
import { createImportsStore } from './importsStore';
import { createInteractionsStore } from './interactionsStore';
import { createProgressStore } from './progressStore';
import { createSettingsStore } from './settingsStore';
import { createStoragesStore } from './storagesStore';

export { type EditGroupInfo } from './editStore';
export { type FiltersState, ImageSelectionMode } from './filtersStore';
export { type TrashCount, type InteractionsState, type ErrorMessage } from './interactionsStore';
export { type LogItem, type ProgressState, LogType } from './progressStore';
export { ITEMS_STORE_VERSION } from './constants';

export const useDialogsStore = createDialogsStore();
export const useInteractionsStore = createInteractionsStore();
export const useEditStore = createEditStore();
export const useFiltersStore = createFiltersStore();
export const useImportsStore = createImportsStore();
export const useProgressStore = createProgressStore();
export const useSettingsStore = createSettingsStore();
export const useStoragesStore = createStoragesStore();

if (typeof window !== 'undefined') {
  useFiltersStore.getState().cleanRecentImports();
}
