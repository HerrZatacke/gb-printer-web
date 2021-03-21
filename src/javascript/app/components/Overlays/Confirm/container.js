import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const toConfirm = state.confirm[0];
  if (!toConfirm) {
    return {};
  }

  return ({
    message: toConfirm.message,
    questions: toConfirm.questions,
    confirm: toConfirm.confirm,
    deny: toConfirm.deny,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
