import { connect } from 'react-redux';
import { Actions } from '../../store/actions';

const mapStateToProps = (state, { shortName }) => ({
  isActive: state.activePalette === shortName,
});

const mapDispatchToProps = (dispatch, { shortName, name }) => ({
  setActive: () => {
    dispatch({
      type: Actions.PALETTE_SET_ACTIVE,
      payload: shortName,
    });
  },
  deletePalette: () => {
    dispatch({
      type: Actions.CONFIRM_ASK,
      payload: {
        message: `Delete palette "${name || 'no name'}"?`,
        confirm: () => {
          dispatch({
            type: Actions.PALETTE_DELETE,
            payload: { shortName },
          });
        },
        deny: () => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          });
        },
      },
    });
  },
  editPalette: () => {
    dispatch({
      type: Actions.PALETTE_EDIT,
      payload: shortName,
    });
  },
  clonePalette: () => {
    dispatch({
      type: Actions.PALETTE_CLONE,
      payload: shortName,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
