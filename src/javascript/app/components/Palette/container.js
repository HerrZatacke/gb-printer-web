import { connect } from 'react-redux';

const mapStateToProps = (state, { shortName }) => ({
  isActive: state.activePalette === shortName,
});

const mapDispatchToProps = (dispatch, { shortName }) => ({
  setActive: () => {
    dispatch({
      type: 'PALETTE_SET_ACTIVE',
      payload: shortName,
    });
  },
  deletePalette: () => {
    dispatch({
      type: 'PALETTE_DELETE',
      payload: shortName,
    });
  },
  editPalette: () => {
    dispatch({
      type: 'PALETTE_EDIT',
      payload: shortName,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
