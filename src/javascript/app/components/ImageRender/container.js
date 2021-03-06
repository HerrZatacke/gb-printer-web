import { connect } from 'react-redux';
import loadImageTiles from '../../../tools/loadImageTiles';

const mapStateToProps = (state) => ({
  loadImageTiles,
  images: state.images,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
