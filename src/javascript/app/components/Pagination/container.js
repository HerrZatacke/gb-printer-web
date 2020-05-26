import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  totalPages: state.pageSize ? Math.ceil(state.images.length / state.pageSize) : 0,
  currentPage: state.currentPage,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentPage: (currentPage) => {
    dispatch({
      type: 'SET_CURRENTPAGE',
      payload: currentPage,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
