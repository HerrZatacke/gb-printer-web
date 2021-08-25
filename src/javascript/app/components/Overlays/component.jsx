import React from 'react';
import PropTypes from 'prop-types';
import ProgressLogBox from './ProgressLogBox';
import InfoBox from './InfoBox';
import ProgressBox from './ProgressBox';
import Confirm from './Confirm';
import EditForm from './EditForm';
import EditPalette from './EditPalette';
import VideoParamsForm from './VideoParamsForm';
import LightboxImage from './LightboxImage';
import RGBNImage from './RGBNImage';
import DragOver from './DragOver';
import FilterForm from './FilterForm';
import SortForm from './SortForm';
import SyncSelect from './SyncSelect';
import ConnectSerial from './ConnectSerial';

const Overlays = ({
  showProgressLog,
  showInfoBox,
  showProgressBox,
  showConfirm,
  showEditForm,
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
    case showProgressLog:
      return <ProgressLogBox />;
    case showInfoBox:
      return <InfoBox />;
    case showProgressBox:
      return <ProgressBox />;
    case showConfirm:
      return <Confirm />;
    case showEditForm:
      return <EditForm />;
    case showEditPalette:
      return <EditPalette />;
    case showVideoForm:
      return <VideoParamsForm />;
    case showRGBNImage:
      return <RGBNImage />;
    case showLightbox:
      return <LightboxImage />;
    case showDragOver:
      return <DragOver />;
    case showFilters:
      return <FilterForm />;
    case showSortForm:
      return <SortForm />;
    case syncSelect:
      return <SyncSelect />;
    default: // Default: Components which control their show/hide status themselves (e.g. through a hook)
      return <ConnectSerial />;
  }
};

Overlays.propTypes = {
  showProgressLog: PropTypes.bool.isRequired,
  showInfoBox: PropTypes.bool.isRequired,
  showProgressBox: PropTypes.bool.isRequired,
  showConfirm: PropTypes.bool.isRequired,
  showEditForm: PropTypes.bool.isRequired,
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
