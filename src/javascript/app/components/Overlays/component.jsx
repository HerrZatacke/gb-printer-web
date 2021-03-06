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
}) => (
  <>
    {showProgressLog ? <ProgressLogBox /> : null }
    {showInfoBox ? <InfoBox /> : null }
    {showProgressBox ? <ProgressBox /> : null }
    {showConfirm ? <Confirm /> : null }
    {showEditForm ? <EditForm /> : null }
    {showEditPalette ? <EditPalette /> : null }
    {showVideoForm ? <VideoParamsForm /> : null }
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
