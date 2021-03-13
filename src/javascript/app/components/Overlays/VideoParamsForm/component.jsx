import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '../../Lightbox/component';
import SVG from '../../SVG';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import Input from '../../Input';

const VideoParamsForm = (props) => {

  const {
    update,
    cancel,
    imageCount,
    animate,
  } = props;

  const [frameRate, setFrameRate] = useState(props.frameRate);
  const [scaleFactor, setScaleFactor] = useState(props.scaleFactor);
  const [palette, setPalette] = useState(props.palette);
  const [invertPalette, setInvertPalette] = useState(props.invertPalette);
  const [yoyo, setYoyo] = useState(props.yoyo);
  const [frame, setFrame] = useState(props.frame);
  const [lockFrame, setLockFrame] = useState(props.lockFrame);
  const [cropFrame, setCropFrame] = useState(props.cropFrame);

  useEffect(() => {
    const cleanState = {
      frameRate: Math.min(120, Math.max(1, parseInt(frameRate, 10))),
      scaleFactor: Math.min(12, Math.max(1, parseInt(scaleFactor, 10))),
      palette,
      invertPalette,
      yoyo,
      frame,
      lockFrame,
      cropFrame,
    };

    update(cleanState);
  }, [frameRate, scaleFactor, palette, invertPalette, yoyo, frame, lockFrame, cropFrame, update]);

  if (!imageCount) {
    return null;
  }

  return (
    <Lightbox
      className="video-params"
      confirm={animate}
      deny={cancel}
      header={`Create an animated GIF with ${imageCount} frames`}
    >
      <Input
        id="video-params-frameRate"
        labelText="Framerate"
        type="number"
        min={1}
        max={120}
        value={frameRate}
        onChange={setFrameRate}
      />
      <Input
        id="video-params-scaleFactor"
        labelText="Scale GIF"
        type="number"
        min={1}
        max={12}
        value={scaleFactor}
        onChange={setScaleFactor}
      />
      <label
        className={
          classnames('video-params__check-label', {
            'video-params__check-label--checked': yoyo,
          })
        }
        title="Enable Yoyo-Effect (loop back to the beginning)"
      >
        <input
          type="checkbox"
          className="video-params__checkbox"
          checked={yoyo}
          onChange={(ev) => {
            setYoyo(ev.target.checked);
          }}
        />
        <SVG name="checkmark" />
        <span className="video-params__check-label-text">Yoyo-Effect</span>
      </label>
      <div className="video-params__select-label">
        Palette
      </div>
      <PaletteSelect
        noFancy
        allowEmpty
        value={palette}
        invertPalette={invertPalette}
        onChange={setPalette}
        updateInvertPalette={setInvertPalette}
      />
      <label
        className={
          classnames('video-params__check-label', {
            'video-params__check-label--checked': cropFrame,
          })
        }
      >
        <input
          type="checkbox"
          className="video-params__checkbox"
          checked={cropFrame}
          onChange={(ev) => {
            setCropFrame(ev.target.checked);
          }}
        />
        <SVG name="checkmark" />
        <span className="video-params__check-label-text">
          Crop/remove frame
        </span>
      </label>
      { cropFrame ? null : (
        <>
          <div className="video-params__select-label">
            Frame
          </div>
          <FrameSelect
            frame={frame}
            lockFrame={lockFrame}
            noFrameOption="As selected per image"
            updateFrame={setFrame}
            updateFrameLock={setLockFrame}
          />
        </>
      )}
    </Lightbox>
  );
};

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
