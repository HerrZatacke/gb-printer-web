import { initGapiSync } from '@/stores/sync/initGapiSync';
import { createDialogsStore } from './dialogsStore';
import { createEditStore } from './editStore';
import { createFiltersStore } from './filtersStore';
import { createImportsStore } from './importsStore';
import { createInteractionsStore } from './interactionsStore';
import { createItemsStore } from './itemsStore';
import { createProgressStore } from './progressStore';
import { createSettingsStore } from './settingsStore';
import { createStoragesStore } from './storagesStore';

export const useDialogsStore = createDialogsStore();
export const useEditStore = createEditStore();
export const useFiltersStore = createFiltersStore();
export const useImportsStore = createImportsStore();
export const useInteractionsStore = createInteractionsStore();
export const useItemsStore = createItemsStore();
export const useProgressStore = createProgressStore();
export const useSettingsStore = createSettingsStore();
export const useStoragesStore = createStoragesStore();

initGapiSync(useStoragesStore, useItemsStore);
