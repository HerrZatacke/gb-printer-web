import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  images: state.images,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
