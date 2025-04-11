import React from 'react';
import classnames from 'classnames';
import type { ExportFrameMode } from 'gb-image-decoder';
import OldLightbox from '../../Lightbox';
import SVG from '../../SVG';
import FrameSelect from '../../FrameSelect';
import PaletteSelect from '../../PaletteSelect';
import Input, { InputType } from '../../Input';
import exportFrameModes from '../../../../consts/exportFrameModes';
import { useVideoForm } from './useVideoForm';

import './index.scss';

function VideoParamsForm() {

  const {
    update,
    cancel,
    imageCount,
    animate,
    videoParams,
  } = useVideoForm();

  if (!imageCount) {
    return null;
  }

  return (
    <OldLightbox
      className="video-params"
      confirm={animate}
      deny={cancel}
      header={`Create an animated GIF with ${imageCount} frames`}
    >
      <Input
        id="video-params-frameRate"
        labelText="Framerate"
        type={InputType.NUMBER}
        min={1}
        max={120}
        value={videoParams.frameRate}
        onChange={(value) => {
          update({ frameRate: parseInt(value, 10) });
        }}
      />
      <Input
        id="video-params-scaleFactor"
        labelText="Scale GIF"
        type={InputType.NUMBER}
        min={1}
        max={12}
        value={videoParams.scaleFactor}
        onChange={(value) => {
          update({ scaleFactor: parseInt(value, 10) });
        }}
      />
      <label
        className={
          classnames('video-params__check-label', {
            'video-params__check-label--checked': videoParams.yoyo,
          })
        }
        title="Enable Yoyo-Effect (loop back to the beginning)"
      >
        <input
          type="checkbox"
          className="video-params__checkbox"
          checked={videoParams.yoyo}
          onChange={(ev) => {
            update({ yoyo: ev.target.checked });
          }}
        />
        <SVG name="checkmark" />
        <span className="video-params__check-label-text">Yoyo-Effect</span>
      </label>
      <label
        className={
          classnames('video-params__check-label', {
            'video-params__check-label--checked': videoParams.reverse,
          })
        }
        title="Reverse animation direction"
      >
        <input
          type="checkbox"
          className="video-params__checkbox"
          checked={videoParams.reverse}
          onChange={(ev) => {
            update({ reverse: ev.target.checked });
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
        value={videoParams.palette || ''}
        invertPalette={videoParams.invertPalette}
        onChange={(palette) => {
          update({ palette });
        }}
        updateInvertPalette={(invertPalette) => {
          update({ invertPalette });
        }}
      />

      <label htmlFor="settings-handle-export-frames" className="video-params__select-label">
        How to handle frames when exporting images
      </label>
      <select
        id="settings-handle-export-frames"
        className="video-params__frameexport-select"
        value={videoParams.exportFrameMode}
        onChange={(ev) => {
          update({ exportFrameMode: ev.target.value as ExportFrameMode });
        }}
      >
        {
          exportFrameModes.map(({ id, name }) => (
            <option value={id} key={id}>{ name }</option>
          ))
        }
      </select>

      { videoParams.exportFrameMode === 'crop' ? null : (
        <>
          <div className="video-params__select-label">
            Frame
          </div>
          <FrameSelect
            frame={videoParams.frame || ''}
            lockFrame={videoParams.lockFrame}
            noFrameOption="As selected per image"
            updateFrame={(frame) => {
              update({ frame });
            }}
            updateFrameLock={(lockFrame) => {
              update({ lockFrame });
            }}
          />
        </>
      )}
    </OldLightbox>
  );
}

export default VideoParamsForm;
