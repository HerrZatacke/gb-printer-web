import { connect } from 'react-redux';
import loadImageTiles from '../../../tools/loadImageTiles';
import { TRY_RECOVER_IMAGE_DATA } from '../../store/actions';

const mapStateToProps = (state) => ({
  loadImageTiles: loadImageTiles(state),
});

const mapDispatchToProps = (dispatch) => ({
  recover: (hash) => {
    dispatch({
      type: TRY_RECOVER_IMAGE_DATA,
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
