import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  totalPages: state.pageSize ? Math.ceil(state.images.length / state.pageSize) : 0,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
