import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  message: state.confirmation.message || null,
});

const mapDispatchToProps = (dispatch) => ({
  confirm: () => {
    dispatch({
      type: 'CONFIRM_CONFIRMATION',
    });
  },
  deny: () => {
    dispatch({
      type: 'DENY_CONFIRMATION',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
