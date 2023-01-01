import React from 'react';
import { useSelector } from 'react-redux';
import ProgressLogBox from './ProgressLogBox';
import InfoBox from './InfoBox';
import ProgressBox from './ProgressBox';
import Confirm from './Confirm';
import EditForm from './EditForm';
import EditFrame from './EditFrame';
import EditPalette from './EditPalette';
import VideoParamsForm from './VideoParamsForm';
import LightboxImage from './LightboxImage';
import RGBNImage from './RGBNImage';
import DragOver from './DragOver';
import FilterForm from './FilterForm';
import SortForm from './SortForm';
import SyncSelect from './SyncSelect';
import ConnectSerial from './ConnectSerial';
import BitmapQueue from './BitmapQueue';
import ImportQueue from './ImportQueue';
import FrameQueue from './FrameQueue';

const Overlays = () => {
  const {
    showProgressLog,
    showInfoBox,
    showProgressBox,
    showConfirm,
    showBitmapQueue,
    showImportQueue,
    showFrameQueue,
    showEditForm,
    showEditFrame,
    showEditPalette,
    showVideoForm,
    showRGBNImage,
    showLightbox,
    showDragOver,
    showFilters,
    showSortForm,
    syncSelect,
  } = useSelector((state) => ({
    showProgressLog: !!state.progressLog.git.length || !!state.progressLog.dropbox.length,
    showInfoBox: state.framesMessage === 1,
    showProgressBox: !!state.progress.gif || !!state.progress.printer || !!state.progress.plugin,
    showConfirm: !!state.confirm.length,
    showBitmapQueue: !!state.bitmapQueue.length,
    showImportQueue: !!state.importQueue.length,
    showFrameQueue: !!state.frameQueue.length,
    showEditForm: !!state.editImage,
    showEditFrame: !!state.editFrame,
    showEditPalette: !!state.editPalette.shortName,
    showVideoForm: !!state.videoParams.imageSelection && !!state.videoParams.imageSelection.length,
    showRGBNImage: !!state.rgbnImages && Object.keys(state.rgbnImages).length > 0,
    showLightbox: state.lightboxImage !== null,
    showDragOver: !!state.dragover,
    showFilters: !!state.filtersVisible,
    showSortForm: !!state.sortOptionsVisible,
    syncSelect: !!state.syncSelect,
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
    case showEditFrame:
      return <EditFrame />; // interactive
    case showEditPalette:
      return <EditPalette />; // interactive
    case showVideoForm:
      return <VideoParamsForm />; // interactive
    case showLightbox:
      return <LightboxImage />; // interactive
    case showFilters:
      return <FilterForm />; // interactive
    case showSortForm:
      return <SortForm />; // interactive
    case syncSelect:
      return <SyncSelect />; // interactive
    case showDragOver:
      return <DragOver />; // semi-interactive
    case showProgressLog:
      return <ProgressLogBox />; // non-interactive
    case showProgressBox:
      return <ProgressBox />; // non-interactive
    case showRGBNImage:
      return <RGBNImage />; // non-interactive
    default: // Default: Components which control their show/hide status themselves (e.g. through a hook)
      return <ConnectSerial />;
  }
};

export default Overlays;
