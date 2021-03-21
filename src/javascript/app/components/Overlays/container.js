import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  showProgressLog: !!state.progressLog,
  showInfoBox: state.framesMessage === 1,
  showProgressBox: !!state.progress.gif,
  showConfirm: !!state.confirm.length,
  showConfirmation: !!state.confirmation.message,
  showEditForm: !!state.editImage,
  showEditPalette: !!state.editPalette.shortName,
  showVideoForm: !!state.videoParams.imageSelection && !!state.videoParams.imageSelection.length,
  showLiveImage: true, // animating ?
  showRGBNImage: true, // animating ?
  showLightbox: state.lightboxImage !== null,
  showDragOver: !!state.dragover,
  showFilters: !!state.filter.visible,
  showSortForm: !!state.sortOptionsVisible,
  syncSelect: !!state.syncSelect,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
