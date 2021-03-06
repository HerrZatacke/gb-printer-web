import { connect } from 'react-redux';
import loadImageTiles from '../../../tools/loadImageTiles';

const mapStateToProps = (state) => ({
  loadImageTiles: loadImageTiles(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
