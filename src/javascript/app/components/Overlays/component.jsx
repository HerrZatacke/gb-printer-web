import React from 'react';
import PropTypes from 'prop-types';
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

const Overlays = ({
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
}) => {
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

Overlays.propTypes = {
  showProgressLog: PropTypes.bool.isRequired,
  showInfoBox: PropTypes.bool.isRequired,
  showProgressBox: PropTypes.bool.isRequired,
  showConfirm: PropTypes.bool.isRequired,
  showBitmapQueue: PropTypes.bool.isRequired,
  showImportQueue: PropTypes.bool.isRequired,
  showFrameQueue: PropTypes.bool.isRequired,
  showEditForm: PropTypes.bool.isRequired,
  showEditFrame: PropTypes.bool.isRequired,
  showEditPalette: PropTypes.bool.isRequired,
  showVideoForm: PropTypes.bool.isRequired,
  showRGBNImage: PropTypes.bool.isRequired,
  showLightbox: PropTypes.bool.isRequired,
  showDragOver: PropTypes.bool.isRequired,
  showFilters: PropTypes.bool.isRequired,
  showSortForm: PropTypes.bool.isRequired,
  syncSelect: PropTypes.bool.isRequired,
};

Overlays.defaultProps = {};

export default Overlays;
