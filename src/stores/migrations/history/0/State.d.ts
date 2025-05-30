import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';
import type { DropBoxSettings, GitStorageSettings, RecentImport, SyncLastUpdate } from '@/types/Sync';
import type { VideoParams } from '@/types/VideoParams';

export interface ReduxState {
  // ItemsState
  frameGroupNames: FrameGroup[],
  frames: Frame[],
  images: Image[],
  imageGroups: SerializableImageGroup[],
  palettes: Palette[],
  plugins: Plugin[],

  // SettingsState
  activePalette: string,
  enableDebug: boolean,
  enableImageGroups: boolean,
  exportFileTypes: string[],
  exportScaleFactors: number[],
  forceMagicCheck: boolean,
  galleryView: string,
  handleExportFrame: string,
  hideDates: boolean,
  importDeleted: boolean,
  importLastSeen: boolean,
  importPad: boolean,
  pageSize: number,
  preferredLocale: string,
  printerParams: string,
  printerUrl: string,
  savFrameTypes: string,
  sortPalettes: string,
  useSerials: boolean,
  videoParams: VideoParams,

  // FiltersState
  filtersActiveTags: string[],
  imageSelection: string[],
  recentImports: RecentImport[],
  sortBy: string,

  // StoragesState
  dropboxStorage: DropBoxSettings,
  gitStorage: GitStorageSettings,
  syncLastUpdate: SyncLastUpdate,
}
