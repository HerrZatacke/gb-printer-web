import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  showGitLog: !!state.gitLog,
  showInfoBox: state.framesMessage === 1,
  showProgressBox: !!state.progress.gif,
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
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
