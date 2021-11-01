import { connect } from 'react-redux';
import { NEW_PALETTE_SHORT } from '../../../consts/specialTags';
import { PALETTE_EDIT } from '../../store/actions';

const mapStateToProps = (state) => ({
  palettes: state.palettes,
});

const mapDispatchToProps = (dispatch) => ({
  newPalette: () => {
    dispatch({
      type: PALETTE_EDIT,
      payload: NEW_PALETTE_SHORT,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
