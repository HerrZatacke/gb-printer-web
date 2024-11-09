import React from 'react';
import { useSelector } from 'react-redux';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useImportsStore from '../../stores/importsStore';
import useInteractionsStore from '../../stores/interactionsStore';
import useSettingsStore from '../../stores/settingsStore';
import ProgressLogBox from './ProgressLogBox';
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
  const { enableImageGroups } = useSettingsStore();

  const {
    showEditForm,
    showEditImageGroup,
    showEditPalette,
    showEditRGBN,
    showPickColors,
  } = useSelector((state: State) => ({
    showEditForm: !!state.editImage?.batch?.length,
    showEditImageGroup: !!state.editImageGroup && enableImageGroups,
    showEditPalette: !!state.editPalette,
    showEditRGBN: state.editRGBNImages.length > 0,
    showPickColors: !!state.pickColors,
  }));

  const { dialogs } = useDialogsStore();

  const showConfirm = !!dialogs.length;

  const { editFrame } = useEditStore();

  const showEditFrame = !!editFrame;

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
    progress,
    progressLog,
    syncSelect,
    videoSelection,
  } = useInteractionsStore();

  const showProgressLog = !!progressLog.git.length || !!progressLog.dropbox.length;
  const showProgressBox = !!progress.gif || !!progress.printer || !!progress.plugin;
  const showVideoForm = !!videoSelection?.length;

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
