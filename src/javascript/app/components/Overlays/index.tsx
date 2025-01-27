import React from 'react';
import { useSelector } from 'react-redux';
import ProgressLogBox from './ProgressLogBox';
import InfoBox from './InfoBox';
import ProgressBox from './ProgressBox';
import Confirm from './Confirm';
import EditForm from './EditForm';
import EditImageGroup from './EditImageGroup';
import EditFrame from './EditFrame';
import EditPalette from './EditPalette';
import EditRGBN from './EditRGBN';
import VideoParamsForm from './VideoParamsForm';
import LightboxImage from './LightboxImage';
import DragOver from './DragOver';
import FilterForm from './FilterForm';
import SortForm from './SortForm';
import SyncSelect from './SyncSelect';
import ConnectSerial from './ConnectSerial';
import BitmapQueue from './BitmapQueue';
import ImportQueue from './ImportQueue';
import FrameQueue from './FrameQueue';
import Trashbin from './Trashbin';
import PickColors from './PickColors';
import type { State } from '../../store/State';

function Overlays() {
  const {
    showProgressLog,
    showInfoBox,
    showProgressBox,
    showConfirm,
    showBitmapQueue,
    showImportQueue,
    showFrameQueue,
    showEditForm,
    showEditImageGroup,
    showEditFrame,
    showEditPalette,
    showEditRGBN,
    showVideoForm,
    showPickColors,
    showLightboxImage,
    showDragOver,
    showFilters,
    showSortForm,
    showTrashbin,
    syncSelect,
  } = useSelector((state: State) => ({
    showProgressLog: !!state.progressLog.git.length || !!state.progressLog.dropbox.length,
    showInfoBox: state.framesMessage === 1,
    showProgressBox: !!state.progress.gif || !!state.progress.printer || !!state.progress.plugin,
    showConfirm: !!state.confirm.length,
    showBitmapQueue: !!state.bitmapQueue.length,
    showImportQueue: !!state.importQueue.length,
    showFrameQueue: !!state.frameQueue.length,
    showEditForm: !!state.editImage?.batch?.length,
    showEditImageGroup: !!state.editImageGroup && state.enableImageGroups,
    showEditFrame: !!state.editFrame,
    showEditPalette: !!state.editPalette,
    showEditRGBN: state.editRGBNImages.length > 0,
    showVideoForm: !!state.videoParams.imageSelection?.length,
    showPickColors: !!state.pickColors,
    showLightboxImage: state.lightboxImage !== null,
    showDragOver: state.dragover,
    showFilters: state.filtersVisible,
    showSortForm: state.sortOptionsVisible,
    showTrashbin: state.trashCount.show,
    syncSelect: state.syncSelect,
  }));

  switch (true) {
    case showInfoBox:
      return <InfoBox />; // interactive
    case showConfirm:
      return <Confirm />; // interactive
    case showFrameQueue:
      return <FrameQueue />; // interactive
    case showBitmapQueue:
      return <BitmapQueue />; // interactive
    case showImportQueue:
      return <ImportQueue />; // interactive
    case showEditForm:
      return <EditForm />; // interactive
    case showEditImageGroup:
      return <EditImageGroup />; // interactive
    case showEditFrame:
      return <EditFrame />; // interactive
    case showEditPalette:
      return <EditPalette />; // interactive
    case showEditRGBN:
      return <EditRGBN />; // interactive
    case showVideoForm:
      return <VideoParamsForm />; // interactive
    case showPickColors:
      return <PickColors />; // interactive
    case showLightboxImage:
      return <LightboxImage />; // interactive
    case showFilters:
      return <FilterForm />; // interactive
    case showSortForm:
      return <SortForm />; // interactive
    case syncSelect:
      return <SyncSelect />; // interactive
    case showTrashbin:
      return <Trashbin />; // interactive
    case showDragOver:
      return <DragOver />; // semi-interactive
    case showProgressLog:
      return <ProgressLogBox />; // non-interactive
    case showProgressBox:
      return <ProgressBox />; // non-interactive
    default: // Default: Components which control their show/hide status themselves (e.g. through a hook)
      return <ConnectSerial />;
  }
}

export default Overlays;
