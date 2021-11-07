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
            <Frame
              id={frame.id}
              key={`frame-${frame.id}`}
              name={frame.name}
              palette={palette}
            />
          ))
        )}
        <li className="frame frame--dummy" key="dummy1" />
        <li className="frame frame--dummy" key="dummy2" />
        <li className="frame frame--dummy" key="dummy3" />
        <li className="frame frame--dummy" key="dummy4" />
        <li className="frame frame--dummy" key="dummy5" />
      </ul>
    </div>
  );
};

Frames.propTypes = {};

Frames.defaultProps = {};

export default Frames;
