import { connect } from 'react-redux';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';

const mapStateToProps = (state) => ({
  totalPages: state.pageSize ? Math.ceil(getFilteredImagesCount(state) / state.pageSize) : 0,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
