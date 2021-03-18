import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  printerUrl: state.printerUrl ? `${state.printerUrl}remote.html` : null,
  printerConnected: state.printerFunctions.length > 0,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
