import { createDialogsStore } from './dialogsStore';
import { createEditStore } from './editStore';
import { createFiltersStore } from './filtersStore';
import { createImportsStore } from './importsStore';
import { createInteractionsStore } from './interactionsStore';
import { createItemsStore } from './itemsStore';
import { createProgressStore } from './progressStore';
import { createSettingsStore } from './settingsStore';
import { createStoragesStore } from './storagesStore';

export { type EditGroupInfo } from './editStore';
export { type FiltersState, ImageSelectionMode } from './filtersStore';
export { type TrashCount, type InteractionsState, type ErrorMessage } from './interactionsStore';
export { type ItemsState, type Values, ITEMS_STORE_VERSION } from './itemsStore';
export { type LogItem, type ProgressState, LogType } from './progressStore';

export const useDialogsStore = createDialogsStore();
export const useEditStore = createEditStore();
export const useFiltersStore = createFiltersStore();
export const useImportsStore = createImportsStore();
export const useInteractionsStore = createInteractionsStore();
export const useItemsStore = createItemsStore();
export const useProgressStore = createProgressStore();
export const useSettingsStore = createSettingsStore();
export const useStoragesStore = createStoragesStore();
