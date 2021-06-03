import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const printerParams = state.printerParams ? `#${encodeURI(state.printerParams)}` : '';
  return ({
    printerUrl: state.printerUrl ? `${state.printerUrl}remote.html${printerParams}` : null,
    printerConnected: state.printerFunctions.length > 0,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
