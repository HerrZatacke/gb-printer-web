import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import SVG from '../../SVG';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import Input from '../../Input';
import exportFrameModes from '../../../../consts/exportFrameModes';

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
  const [reverse, setReverse] = useState(props.reverse);
  const [frame, setFrame] = useState(props.frame);
  const [lockFrame, setLockFrame] = useState(props.lockFrame);
  const [exportFrameMode, setExportFrameMode] = useState(props.exportFrameMode);

  useEffect(() => {
    const cleanState = {
      frameRate: Math.min(120, Math.max(1, parseInt(frameRate, 10))),
      scaleFactor: Math.min(12, Math.max(1, parseInt(scaleFactor, 10))),
      palette,
      invertPalette,
      yoyo,
      reverse,
      frame,
      lockFrame,
      exportFrameMode,
    };

    update(cleanState);
  }, [frameRate, scaleFactor, palette, invertPalette, yoyo, reverse, frame, lockFrame, exportFrameMode, update]);

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
      <label
        className={
          classnames('video-params__check-label', {
            'video-params__check-label--checked': reverse,
          })
        }
        title="Reverse animation direction"
      >
        <input
          type="checkbox"
          className="video-params__checkbox"
          checked={reverse}
          onChange={(ev) => {
            setReverse(ev.target.checked);
          }}
        />
        <SVG name="checkmark" />
        <span className="video-params__check-label-text">Reverse Direction</span>
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

      <label htmlFor="settings-handle-export-frames" className="video-params__select-label">
        How to handle frames when exporting images
      </label>
      <select
        id="settings-handle-export-frames"
        className="video-params__frameexport-select"
        value={exportFrameMode}
        onChange={(ev) => {
          setExportFrameMode(ev.target.value);
        }}
      >
        {
          exportFrameModes.map(({ id, name }) => (
            <option value={id} key={id}>{ name }</option>
          ))
        }
      </select>

      { exportFrameMode === 'crop' ? null : (
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
  reverse: PropTypes.bool.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  exportFrameMode: PropTypes.string.isRequired,
  frame: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  animate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default VideoParamsForm;
