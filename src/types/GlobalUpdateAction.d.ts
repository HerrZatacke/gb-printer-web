import { Actions } from '../javascript/app/store/actions';
import { FrameGroup } from './FrameGroup';
import { Frame } from './Frame';
import { GalleryViews } from '../javascript/consts/GalleryViews';
import { ExportFrameMode } from '../javascript/consts/exportFrameModes';
import { Image } from './Image';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload: {
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
    importPad ?: boolean,
  }
}
