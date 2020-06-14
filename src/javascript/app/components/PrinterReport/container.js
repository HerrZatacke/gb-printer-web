import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  printerData: state.printerData,
  printerUrl: state.printerUrl,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
