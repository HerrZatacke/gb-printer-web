import { connect } from 'react-redux';

const mapStateToProps = (state, { shortName }) => ({
  isActive: state.activePalette === shortName,
});

const mapDispatchToProps = (dispatch, { shortName, name }) => ({
  setActive: () => {
    dispatch({
      type: 'PALETTE_SET_ACTIVE',
      payload: shortName,
    });
  },
  deletePalette: () => {
    dispatch({
      type: 'CONFIRM_ASK',
      payload: {
        message: `Delete palette "${name || 'no name'}"?`,
        id: shortName,
        confirm: () => {
          dispatch({
            type: 'PALETTE_DELETE',
            payload: { shortName },
            confirmId: shortName,
          });
        },
        deny: () => {
          dispatch({
            type: 'CONFIRM_ANSWERED',
            payload: shortName,
            confirmId: shortName,
          });
        },
      },
    });
  },
  editPalette: () => {
    dispatch({
      type: 'PALETTE_EDIT',
      payload: shortName,
    });
  },
  clonePalette: () => {
    dispatch({
      type: 'PALETTE_CLONE',
      payload: shortName,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
