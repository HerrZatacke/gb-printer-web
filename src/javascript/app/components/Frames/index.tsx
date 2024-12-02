import React from 'react';
import useFrames from './useFrames';
import Frame from '../Frame';
import Input, { InputType } from '../Input';
import { ExportTypes } from '../../../consts/exportTypes';

import './index.scss';

function Frames() {

  const {
    frameGroups,
    selectedFrameGroup,
    setSelectedFrameGroup,
    palette,
    groupFrames,
    exportJson,
    setActiveFrameGroupName,
    activeFrameGroup,
    convertFormat,
    enableDebug,
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
          <option value="">Select frame group</option>
          {
            frameGroups.map(({ id, name }) => (
              <option value={id} key={id}>{ name }</option>
            ))
          }
        </select>
      </div>
      {
        activeFrameGroup ? (
          <Input
            type={InputType.TEXT}
            id="frames-edit-group-name"
            onChange={setActiveFrameGroupName}
            value={activeFrameGroup.name || ''}
            labelText="Rename Framegroup"
          />
        ) : null
      }
      <ul className="frames__list">
        {(
          groupFrames?.map((frame) => (
            <Frame
              frameId={frame.id}
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
      <div className="inputgroup buttongroup">
        <button
          type="button"
          className="button"
          onClick={() => exportJson(ExportTypes.FRAMES)}
        >
          Export frames
        </button>
        <button
          type="button"
          className="button"
          onClick={() => exportJson(ExportTypes.CURRENT_FRAMEGROUP)}
        >
          {`Export current framegroup (${selectedFrameGroup})`}
        </button>
        {
          enableDebug ? (
            <button
              type="button"
              className="button"
              onClick={convertFormat}
            >
              Convert frames to new format
            </button>
          ) : null
        }
      </div>
    </div>
  );
}

export default Frames;
