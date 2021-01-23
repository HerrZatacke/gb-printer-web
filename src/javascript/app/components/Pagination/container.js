import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state) => ({
  totalPages: state.pageSize ? Math.ceil(getFilteredImages(state, false).length / state.pageSize) : 0,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
