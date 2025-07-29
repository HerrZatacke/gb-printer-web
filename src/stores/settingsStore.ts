import { ExportFrameMode } from 'gb-image-decoder';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ImportContrastValue } from '@/consts/bitmapQueueSettings';
import { FileNameStyle } from '@/consts/fileNameStyles';
import { GalleryClickAction } from '@/consts/GalleryClickAction';
import { GalleryViews } from '@/consts/GalleryViews';
import { PaletteSortMode } from '@/consts/paletteSortModes';
import { SavImportOrder } from '@/consts/SavImportOrder';
import { ThemeName } from '@/consts/theme';
import { defaultLocale, locales } from '@/i18n/locales';
import cleanUrl from '@/tools/cleanUrl';
import type { VideoParams } from '@/types/VideoParams';
import { PROJECT_PREFIX } from './constants';

export interface Settings {
  activePalette: string,
  bitmapQueueDither: boolean,
  bitmapQueueSetting: ImportContrastValue,
  enableDebug: boolean,
  exportFileTypes: string[],
  exportScaleFactors: number[],
  fileNameStyle: FileNameStyle,
  forceMagicCheck: boolean,
  galleryView: GalleryViews,
  galleryClickAction: GalleryClickAction,
  handleExportFrame: ExportFrameMode,
  hideDates: boolean,
  importDeleted: boolean,
  importLastSeen: boolean,
  importPad: boolean,
  lastBaudRate: number,
  pageSize: number,
  preferredLocale: string,
  printerParams: string,
  printerUrl: string,
  savFrameTypes: string,
  savImportOrder: SavImportOrder,
  themeName: ThemeName,
  sortPalettes: PaletteSortMode,
  useSerials: boolean,
  videoParams: VideoParams,
}

interface Actions {
  setActivePalette: (activePalette: string) => void,
  setBitmapQueueDither: (bitmapQueueDither: boolean) => void,
  setBitmapQueueSetting: (bitmapQueueSetting: ImportContrastValue) => void,
  setEnableDebug: (enableDebug: boolean) => void,
  setExportFileTypes: (exportFileTypes: string[]) => void,
  setExportScaleFactors: (exportScaleFactors: number[]) => void
  setFileNameStyle: (fileNameStyle: FileNameStyle) => void,
  setForceMagicCheck: (forceMagicCheck: boolean) => void,
  setGalleryView: (galleryView: GalleryViews) => void,
  setGalleryClickAction: (galleryClickAction: GalleryClickAction) => void,
  setHandleExportFrame: (handleExportFrame: ExportFrameMode) => void,
  setHideDates: (hideDates: boolean) => void,
  setImportDeleted: (importDeleted: boolean) => void,
  setImportLastSeen: (importLastSeen: boolean) => void,
  setImportPad: (importPad: boolean) => void,
  setLastBaudRate: (lastBaudRate: number) => void,
  setPageSize: (pageSize: number) => void
  setPreferredLocale: (preferredLocale: string) => void,
  setPrinterParams: (printerParams: string) => void,
  setPrinterUrl: (printerUrl: string) => void,
  setSavFrameTypes: (savFrameTypes: string) => void,
  setSavImportOrder: (savImportOrder: SavImportOrder) => void,
  setThemeName: (themeName: ThemeName) => void,
  setSortPalettes: (sortPalettes: PaletteSortMode) => void,
  setUseSerials: (useSerials: boolean) => void,
  setVideoParams: (videoParams: Partial<VideoParams>) => void,
}

export type SettingsState = Settings & Actions;

const getDefaultLocale = (): string => {
  let locale = '';
  if (typeof navigator !== 'undefined') {
    const [lang, country] = navigator.language.split('-');
    locale = [lang, country].filter(Boolean).join('-');
  }

  if (locales.includes(locale)) {
    return locale;
  }

  return defaultLocale;
};

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      activePalette: 'bw',
      bitmapQueueDither: true,
      bitmapQueueSetting: ImportContrastValue.WIDE,
      enableDebug: false,
      exportFileTypes: ['png'],
      exportScaleFactors: [4],
      fileNameStyle: FileNameStyle.FULL,
      forceMagicCheck: false,
      galleryView: GalleryViews.GALLERY_VIEW_1X,
      galleryClickAction: GalleryClickAction.SELECT,
      handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
      hideDates: false,
      importDeleted: true,
      importLastSeen: true,
      importPad: false,
      lastBaudRate: 115200,
      pageSize: 30,
      preferredLocale: getDefaultLocale(),
      printerParams: '',
      printerUrl: '',
      savFrameTypes: 'int',
      savImportOrder: SavImportOrder.CART_INDEX,
      themeName: ThemeName.BRIGHT,
      sortPalettes: PaletteSortMode.DEFAULT_DESC,
      useSerials: false,
      videoParams: {},

      setActivePalette: (activePalette: string) => set({ activePalette }),
      setBitmapQueueDither: (bitmapQueueDither: boolean) => set({ bitmapQueueDither }),
      setBitmapQueueSetting: (bitmapQueueSetting: ImportContrastValue) => set({ bitmapQueueSetting }),
      setEnableDebug: (enableDebug: boolean) => set({ enableDebug }),
      setFileNameStyle: (fileNameStyle: FileNameStyle) => set({ fileNameStyle }),
      setForceMagicCheck: (forceMagicCheck: boolean) => set({ forceMagicCheck }),
      setGalleryView: (galleryView: GalleryViews) => set({ galleryView }),
      setGalleryClickAction: (galleryClickAction: GalleryClickAction) => set({ galleryClickAction }),
      setHandleExportFrame: (handleExportFrame: ExportFrameMode) => set({ handleExportFrame }),
      setHideDates: (hideDates: boolean) => set({ hideDates }),
      setImportDeleted: (importDeleted: boolean) => set({ importDeleted }),
      setImportLastSeen: (importLastSeen: boolean) => set({ importLastSeen }),
      setImportPad: (importPad: boolean) => set({ importPad }),
      setLastBaudRate: (lastBaudRate: number) => set({ lastBaudRate }),
      setPageSize: (pageSize: number) => set({ pageSize }),
      setPrinterParams: (printerParams: string) => set({ printerParams }),
      setPrinterUrl: (printerUrl: string) => set({ printerUrl: cleanUrl(printerUrl, 'http') }),
      setSavFrameTypes: (savFrameTypes: string) => set({ savFrameTypes }),
      setSavImportOrder: (savImportOrder: SavImportOrder) => set({ savImportOrder }),
      setThemeName: (themeName: ThemeName) => set({ themeName }),
      setSortPalettes: (sortPalettes: PaletteSortMode) => set({ sortPalettes }),
      setUseSerials: (useSerials: boolean) => set({ useSerials }),
      setVideoParams: (videoParams: Partial<VideoParams>) => set((state) => (
        { videoParams: { ...state.videoParams, ...videoParams } }
      )),

      setExportScaleFactors: (exportScaleFactors: number[]) => set({ exportScaleFactors }),
      setExportFileTypes: (exportFileTypes: string[]) => set({ exportFileTypes }),

      setPreferredLocale: (preferredLocale: string) => {
        if (locales.includes(preferredLocale)) {
          set({ preferredLocale });
        } else {
          console.log(`unknown locale "${preferredLocale}"`);
        }
      },
    }),
    {
      name: `${PROJECT_PREFIX}-settings`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
