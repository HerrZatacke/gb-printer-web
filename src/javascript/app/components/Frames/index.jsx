import React from 'react';
import useFrames from './useFrames';
import Frame from '../Frame';

import './index.scss';

const Frames = () => {

  const {
    frameGroups,
    selectedFrameGroup,
    setSelectedFrameGroup,
    palette,
    deleteFrame,
    groupFrames,
  } = useFrames();

  return (
    <div className="frames">
      <div className="inputgroup">
        <label htmlFor="framegroups" className="inputgroup__label">
          Edit Framegroup
        </label>
        <select
          id="framegroups"
          className="inputgroup__input inputgroup__input--select"
          value={selectedFrameGroup}
          onChange={(ev) => {
            setSelectedFrameGroup(ev.target.value);
          }}
        >
          <option value="">Select Frameset</option>
          {
            frameGroups.map(({ id, name }) => (
              <option value={id} key={id}>{ name }</option>
            ))
          }
        </select>
      </div>

      <ul className="frames__list">
        {(
          groupFrames?.map((frame) => (
            <div
              className="frame"
              key={`frame-${frame.id}`}
            >
              <Frame
                id={frame.id}
                name={frame.name}
                palette={palette}
              />
              <button
                type="button"
                onClick={() => {
                  // eslint-disable-next-line no-alert
                  if (window.confirm('really delete?')) {
                    deleteFrame(frame.id);
                  }
                }}
              >
                DELETE!!
              </button>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

Frames.propTypes = {};

Frames.defaultProps = {};

export default Frames;
