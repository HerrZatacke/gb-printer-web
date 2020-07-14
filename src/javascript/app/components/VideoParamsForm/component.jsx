import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '../Lightbox/component';
import SVG from '../SVG';

class VideoParamsForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      frameRate: props.frameRate,
      scaleFactor: props.scaleFactor,
      yoyo: props.yoyo,
    };

    this.callUpdate = this.callUpdate.bind(this);
  }

  callUpdate() {

    const cleanState = {
      frameRate: Math.min(120, Math.max(1, parseInt(this.state.frameRate, 10))),
      scaleFactor: Math.min(12, Math.max(1, parseInt(this.state.scaleFactor, 10))),
      yoyo: this.state.yoyo,
    };

    this.setState(cleanState);
    this.props.update(cleanState);
  }

  render() {
    if (!this.props.imageCount) {
      return null;
    }

    return (
      <Lightbox
        className="video-params"
        confirm={this.props.animate}
        deny={this.props.cancel}
        header={`Create a video with ${this.props.imageCount} frames`}
      >
        <div className="settings__inputgroup">
          <label
            htmlFor="video-params-frameRate"
            className="settings__label"
          >
            Framerate
          </label>
          <input
            id="video-params-frameRate"
            className="settings__input"
            type="number"
            min="1"
            max="120"
            value={this.state.frameRate}
            onChange={({ target }) => {
              this.setState({
                frameRate: target.value,
              });
            }}
            onBlur={this.callUpdate}
          />
        </div>
        <div className="settings__inputgroup">
          <label
            htmlFor="video-params-scaleFactor"
            className="settings__label"
          >
            Scale video
          </label>
          <input
            id="video-params-scaleFactor"
            className="settings__input"
            type="number"
            min="1"
            max="12"
            value={this.state.scaleFactor}
            onChange={({ target }) => {
              this.setState({
                scaleFactor: target.value,
              });
            }}
            onBlur={this.callUpdate}
          />
        </div>
        <div className="settings__inputgroup">
          <div className="settings__label">
            Yoyo-Effect
          </div>
          <label
            className={
              classnames('settings__label-check video-params__label-check', {
                'video-params__label-check--selected': this.state.yoyo,
              })
            }
            title="Enable Yoyo-Effect (loop back to the beginning)"
          >
            <SVG name="checkmark" />
            <input
              type="checkbox"
              checked={this.state.yoyo}
              onChange={({ target }) => {
                this.setState({
                  yoyo: target.checked,
                }, this.callUpdate);
              }}
            />
          </label>
        </div>
      </Lightbox>
    );
  }
}

VideoParamsForm.propTypes = {
  imageCount: PropTypes.number.isRequired,
  frameRate: PropTypes.number.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  yoyo: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  animate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default VideoParamsForm;
