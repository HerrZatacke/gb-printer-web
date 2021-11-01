import { connect } from 'react-redux';
import { UPDATE_RGBN_PART } from '../../store/actions';

const mapStateToProps = (state, { hash }) => ({
  isR: state.rgbnImages?.r === hash,
  isG: state.rgbnImages?.g === hash,
  isB: state.rgbnImages?.b === hash,
  isN: state.rgbnImages?.n === hash,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateRGBN: (part, checked) => {
    dispatch({
      type: UPDATE_RGBN_PART,
      payload: {
        [part]: checked ? ownProps.hash : '',
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
