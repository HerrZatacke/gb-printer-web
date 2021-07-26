import { connect } from 'react-redux';
import loadImageTiles from '../../../tools/loadImageTiles';

const mapStateToProps = (state) => ({
  loadImageTiles,
  images: state.images,
});

const mapDispatchToProps = (dispatch) => ({
  recover: (hash) => {
    dispatch({
      type: 'TRY_RECOVER_IMAGE_DATA',
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
