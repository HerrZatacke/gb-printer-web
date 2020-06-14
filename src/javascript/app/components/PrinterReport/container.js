import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  printerData: state.printerData,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
