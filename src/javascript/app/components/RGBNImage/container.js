import { connect } from 'react-redux';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const mapStateToProps = (state) => ({
  hashes: {
    r: state.rgbnImages.r,
    g: state.rgbnImages.g,
    b: state.rgbnImages.b,
    n: state.rgbnImages.n,
  },
  frames: getRGBNFrames(state, state.rgbnImages, null),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
