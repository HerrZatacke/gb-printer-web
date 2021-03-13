import React from 'react';
import PropTypes from 'prop-types';
import ProgressLogBox from './ProgressLogBox';
import InfoBox from './InfoBox';
import ProgressBox from './ProgressBox';
import Confirmation from './Confirmation';
import EditForm from './EditForm';
import EditPalette from './EditPalette';
import VideoParamsForm from './VideoParamsForm';
import LiveImage from './LiveImage';
import LightboxImage from './LightboxImage';
import RGBNImage from './RGBNImage';
import DragOver from './DragOver';
import FilterForm from './FilterForm';
import SortForm from './SortForm';
import SyncSelect from './SyncSelect';

const Overlays = ({
  showProgressLog,
  showInfoBox,
  showProgressBox,
  showConfirmation,
  showEditForm,
  showEditPalette,
  showVideoForm,
  showLiveImage,
  showRGBNImage,
  showLightbox,
  showDragOver,
  showFilters,
  showSortForm,
  syncSelect,
}) => (
  <>
    {showProgressLog ? <ProgressLogBox /> : null }
    {showInfoBox ? <InfoBox /> : null }
    {showProgressBox ? <ProgressBox /> : null }
    {showConfirmation ? <Confirmation /> : null }
    {showEditForm ? <EditForm /> : null }
    {showEditPalette ? <EditPalette /> : null }
    {showVideoForm ? <VideoParamsForm /> : null }
    {showLiveImage ? <LiveImage /> : null }
    {showRGBNImage ? <RGBNImage /> : null }
    {showLightbox ? <LightboxImage /> : null }
    {showDragOver ? <DragOver /> : null }
    {showFilters ? <FilterForm /> : null }
    {showSortForm ? <SortForm /> : null }
    {syncSelect ? <SyncSelect /> : null }
  </>
);

Overlays.propTypes = {
  showProgressLog: PropTypes.bool.isRequired,
  showInfoBox: PropTypes.bool.isRequired,
  showProgressBox: PropTypes.bool.isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  showEditForm: PropTypes.bool.isRequired,
  showEditPalette: PropTypes.bool.isRequired,
  showVideoForm: PropTypes.bool.isRequired,
  showLiveImage: PropTypes.bool.isRequired,
  showRGBNImage: PropTypes.bool.isRequired,
  showLightbox: PropTypes.bool.isRequired,
  showDragOver: PropTypes.bool.isRequired,
  showFilters: PropTypes.bool.isRequired,
  showSortForm: PropTypes.bool.isRequired,
  syncSelect: PropTypes.bool.isRequired,
};

Overlays.defaultProps = {};

export default Overlays;
