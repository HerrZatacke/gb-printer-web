import dayjs from 'dayjs';
import { ExportFrameMode } from 'gb-image-decoder';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ImportContrastValue } from '@/consts/bitmapQueueSettings';
import { FileNameStyle } from '@/consts/fileNameStyles';
import { GalleryClickAction } from '@/consts/GalleryClickAction';
import { GalleryViews } from '@/consts/GalleryViews';
import { PaletteSortMode } from '@/consts/paletteSortModes';
import { ThemeName } from '@/consts/theme';
import cleanUrl from '@/tools/cleanUrl';
import dateFormatLocale from '@/tools/dateFormatLocale';
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
  themeName: ThemeName,
  enableImageGroups: boolean,
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
  setThemeName: (themeName: ThemeName) => void,
  setEnableImageGroups: (enableImageGroups: boolean) => void,
  setSortPalettes: (sortPalettes: PaletteSortMode) => void,
  setUseSerials: (useSerials: boolean) => void,
  setVideoParams: (videoParams: Partial<VideoParams>) => void,
}

export type SettingsState = Settings & Actions;

const getDefaultLocale = (): string => {
  if (typeof navigator !== 'undefined') {
    const [lang, country] = navigator.language.split('-');
    return [lang, country].filter(Boolean).join('-');
  }

  return '';
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
      forceMagicCheck: true,
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
      printerUrl: '/',  // when running on an esp8266, the envData context also sets this value
      savFrameTypes: 'int',
      themeName: ThemeName.BRIGHT,
      enableImageGroups: false,
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
      setThemeName: (themeName: ThemeName) => set({ themeName }),
      setEnableImageGroups: (enableImageGroups: boolean) => set({ enableImageGroups }),
      setSortPalettes: (sortPalettes: PaletteSortMode) => set({ sortPalettes }),
      setUseSerials: (useSerials: boolean) => set({ useSerials }),
      setVideoParams: (videoParams: Partial<VideoParams>) => set((state) => (
        { videoParams: { ...state.videoParams, ...videoParams } }
      )),

      setExportScaleFactors: (exportScaleFactors: number[]) => set({ exportScaleFactors }),
      setExportFileTypes: (exportFileTypes: string[]) => set({ exportFileTypes }),

      setPreferredLocale: (preferredLocale: string) => {
        // Try if provided locale can be used without throwing an error
        try {
          dateFormatLocale(dayjs(), preferredLocale);
          set({ preferredLocale });
        } catch (error) {
          console.error(error);
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
