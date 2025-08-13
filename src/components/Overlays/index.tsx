import React from 'react';
import BitmapQueue from '@/components/Overlays/BitmapQueue';
import Confirm from '@/components/Overlays/Confirm';
import DownloadOptions from '@/components/Overlays/DownloadOptions';
import DragOver from '@/components/Overlays/DragOver';
import EditForm from '@/components/Overlays/EditForm';
import EditFrame from '@/components/Overlays/EditFrame';
import EditImageGroup from '@/components/Overlays/EditImageGroup';
import EditPalette from '@/components/Overlays/EditPalette';
import EditRGBN from '@/components/Overlays/EditRGBN';
import FilterForm from '@/components/Overlays/FilterForm';
import FrameQueue from '@/components/Overlays/FrameQueue';
import ImportQueue from '@/components/Overlays/ImportQueue';
import LightboxImages from '@/components/Overlays/LightboxImages';
import PickColors from '@/components/Overlays/PickColors';
import ProgressBox from '@/components/Overlays/ProgressBox';
import ProgressLogBox from '@/components/Overlays/ProgressLogBox';
import Serials from '@/components/Overlays/Serials';
import SortForm from '@/components/Overlays/SortForm';
import SyncSelect from '@/components/Overlays/SyncSelect';
import Trashbin from '@/components/Overlays/Trashbin';
import VideoParamsForm from '@/components/Overlays/VideoParamsForm';
import useDialogsStore from '@/stores/dialogsStore';
import useEditStore from '@/stores/editStore';
import useFiltersStore from '@/stores/filtersStore';
import useImportsStore from '@/stores/importsStore';
import useInteractionsStore from '@/stores/interactionsStore';
import useProgressStore from '@/stores/progressStore';
import useSettingsStore from '@/stores/settingsStore';

function Overlays() {
  const { useSerials } = useSettingsStore();

  const { dialogs } = useDialogsStore();

  const showConfirm = !!dialogs.length;

  const {
    editFrame,
    editImageGroup,
    editImages,
    editPalette,
    editRGBNImages,
    pickColors,
  } = useEditStore();

  const showEditForm = !!editImages?.batch?.length;
  const showEditFrame = !!editFrame;
  const showEditImageGroup = !!editImageGroup;
  const showEditPalette = !!editPalette;
  const showEditRGBN = editRGBNImages.length > 0;
  const showPickColors = !!pickColors;

  const {
    filtersVisible: showFilters,
    sortOptionsVisible: showSortForm,
  } = useFiltersStore();

  const {
    bitmapQueue,
    importQueue,
    frameQueue,
  } = useImportsStore();

  const showBitmapQueue = !!bitmapQueue.length;
  const showImportQueue = !!importQueue.length;
  const showFrameQueue = !!frameQueue.length;

  const {
    lightboxImage,
    dragover: showDragOver,
    trashCount: { show: showTrashbin },
    syncSelect,
    videoSelection,
    showSerials,
    downloadHashes,
  } = useInteractionsStore();

  const {
    progress,
    progressLog,
  } = useProgressStore();

  const showDownloadOverlay = !!downloadHashes.length;
  const showProgressLog = !!progressLog.git.length || !!progressLog.dropbox.length;
  const showProgressBox = !!progress.length;
  const showVideoForm = !!videoSelection?.length;
  const showSerialOverlay = showSerials && useSerials;

  switch (true) {
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
    case lightboxImage !== null:
      return <LightboxImages />; // interactive
    case showFilters:
      return <FilterForm />; // interactive
    case showSortForm:
      return <SortForm />; // interactive
    case syncSelect:
      return <SyncSelect />; // interactive
    case showTrashbin:
      return <Trashbin />; // interactive
    case showSerialOverlay:
      return <Serials />; // interactive
    case showDownloadOverlay:
      return <DownloadOptions />; // interactive
    case showDragOver:
      return <DragOver />; // semi-interactive
    case showProgressLog:
      return <ProgressLogBox />; // non-interactive
    case showProgressBox:
      return <ProgressBox />; // non-interactive
    default:
      return null;
  }
}

export default Overlays;
