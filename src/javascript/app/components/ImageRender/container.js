import { connect } from 'react-redux';
import loadImageTiles from '../../../tools/loadImageTiles';
import { Actions } from '../../store/actions';

const mapStateToProps = (state) => ({
  loadImageTiles: loadImageTiles(state),
});

const mapDispatchToProps = (dispatch) => ({
  recover: (hash) => {
    dispatch({
      type: Actions.TRY_RECOVER_IMAGE_DATA,
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
