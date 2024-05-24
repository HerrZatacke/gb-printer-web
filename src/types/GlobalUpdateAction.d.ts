import { ExportFrameMode } from 'gb-image-decoder';
import { Actions } from '../javascript/app/store/actions';
import { FrameGroup } from './FrameGroup';
import { Frame } from './Frame';
import { GalleryViews } from '../javascript/consts/GalleryViews';
import { Image, RGBNHashes } from './Image';
import { Palette } from './Palette';
import { VideoParams } from './VideoParams';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload?: {
    activePalette?: string,
    newSelectedPalette?: string,
    enableDebug?: boolean,
    exportFileTypes?: string[],
    exportScaleFactors?: number[],
    forceMagicCheck?: boolean,
    frameGroupNames?: FrameGroup[],
    frames?: Frame[],
    galleryView?: GalleryViews,
    handleExportFrame?: ExportFrameMode,
    hideDates?: boolean,
    imageSelection?: string[],
    images?: Image[],
    importDeleted?: boolean,
    importLastSeen?: boolean,
    importPad?: boolean,
    pageSize?: number,
    palettes?: Palette[],
    printerParams?: string,
    printerUrl?: string,
    rgbnImages?: RGBNHashes,
    savFrameTypes?: string,
    sortBy?: string,
    videoParams?: VideoParams,
  }
}
