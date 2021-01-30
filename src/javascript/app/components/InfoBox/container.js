import { connect } from 'react-redux';

const mapStateToProps = (state) => {

  if (state.framesMessage === 1) {
    return {
      message: {
        type: 'FRAMES_MESSAGE_HIDE',
        headline: 'You might be temporarily missing some frames',
        text: [
          'In a recent change the pre-compiled frames have been removed from this application.',
          'The application now however gives you the opportunity to add all fames you like by yourself and also share them with others.',
          'Maybe you have designed some frames by yourself, or you have aquired some previously unknown frames.',
          'To see how you can add the frames, check the "Frames" explanation on the startpage of this app.',
        ],
      },
    };
  }

  return {};
};

const mapDispatchToProps = (dispatch) => ({
  confirm: (type) => {
    dispatch({
      type,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
