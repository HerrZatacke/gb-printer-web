import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  showProgressLog: !!state.progressLog.git.length || !!state.progressLog.dropbox.length,
  showInfoBox: state.framesMessage === 1,
  showProgressBox: !!state.progress.gif || !!state.progress.printer || !!state.progress.plugin,
  showConfirm: !!state.confirm.length,
  showEditForm: !!state.editImage,
  showEditPalette: !!state.editPalette.shortName,
  showVideoForm: !!state.videoParams.imageSelection && !!state.videoParams.imageSelection.length,
  showRGBNImage: !!state.rgbnImages && Object.keys(state.rgbnImages).length > 0,
  showLightbox: state.lightboxImage !== null,
  showDragOver: !!state.dragover,
  showFilters: !!state.filtersVisible,
  showSortForm: !!state.sortOptionsVisible,
  syncSelect: !!state.syncSelect,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
