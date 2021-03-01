import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '../Lightbox/component';
import SVG from '../SVG';
import FrameSelect from '../FrameSelect';
import PaletteSelect from '../PaletteSelect';

class VideoParamsForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      frameRate: props.frameRate,
      scaleFactor: props.scaleFactor,
      palette: props.palette,
      invertPalette: props.invertPalette,
      yoyo: props.yoyo,
      frame: props.frame,
      lockFrame: props.lockFrame,
      cropFrame: props.lockFrame,
    };

    this.callUpdate = this.callUpdate.bind(this);
  }

  callUpdate() {

    const cleanState = {
      frameRate: Math.min(120, Math.max(1, parseInt(this.state.frameRate, 10))),
      scaleFactor: Math.min(12, Math.max(1, parseInt(this.state.scaleFactor, 10))),
      palette: this.state.palette,
      invertPalette: this.state.invertPalette,
      yoyo: this.state.yoyo,
      frame: this.state.frame,
      lockFrame: this.state.lockFrame,
      cropFrame: this.state.cropFrame,
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
        confirm={() => {
          this.callUpdate();
          this.props.animate();
        }}
        deny={this.props.cancel}
        header={`Create an animated GIF with ${this.props.imageCount} frames`}
      >
        <div className="inputgroup">
          <label
            htmlFor="video-params-frameRate"
            className="inputgroup__label"
          >
            Framerate
          </label>
          <input
            id="video-params-frameRate"
            className="inputgroup__input"
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
        <div className="inputgroup">
          <label
            htmlFor="video-params-scaleFactor"
            className="inputgroup__label"
          >
            Scale GIF
          </label>
          <input
            id="video-params-scaleFactor"
            className="inputgroup__input"
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
        <label
          className={
            classnames('video-params__check-label', {
              'video-params__check-label--checked': this.state.yoyo,
            })
          }
          title="Enable Yoyo-Effect (loop back to the beginning)"
        >
          <input
            type="checkbox"
            className="video-params__checkbox"
            checked={this.state.yoyo}
            onChange={({ target }) => {
              this.setState({
                yoyo: target.checked,
              }, this.callUpdate);
            }}
          />
          <SVG name="checkmark" />
          <span className="video-params__check-label-text">Yoyo-Effect</span>
        </label>
        <label
          className={
            classnames('video-params__check-label', {
              'video-params__check-label--checked': this.props.cropFrame,
            })
          }
        >
          <input
            type="checkbox"
            className="video-params__checkbox"
            checked={this.state.cropFrame}
            onChange={({ target }) => {
              this.setState({
                cropFrame: target.checked,
              }, this.callUpdate);
            }}
          />
          <SVG name="checkmark" />
          <span className="video-params__check-label-text">
            Crop/remove frame
          </span>
        </label>
        <div className="video-params__select-label">
          Palette
        </div>
        <PaletteSelect
          noFancy
          allowEmpty
          value={this.state.palette}
          invertPalette={this.state.invertPalette}
          onChange={(palette) => {
            this.setState({
              palette,
            }, this.callUpdate);
          }}
          updateInvertPalette={(invertPalette) => {
            this.setState({
              invertPalette,
            }, this.callUpdate);
          }}
        />
        { this.state.cropFrame ? null : (
          <>
            <div className="video-params__select-label">
              Frame
            </div>
            <FrameSelect
              frame={this.state.frame}
              lockFrame={this.state.lockFrame}
              noFrameOption="As selected per image"
              updateFrame={(frame) => {
                this.setState({
                  frame,
                }, this.callUpdate);
              }}
              updateFrameLock={(lockFrame) => {
                this.setState({
                  lockFrame,
                }, this.callUpdate);
              }}
            />
          </>
        )}
      </Lightbox>
    );
  }
}

VideoParamsForm.propTypes = {
  imageCount: PropTypes.number.isRequired,
  frameRate: PropTypes.number.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  palette: PropTypes.string.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  yoyo: PropTypes.bool.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  cropFrame: PropTypes.bool.isRequired,
  frame: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  animate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default VideoParamsForm;
