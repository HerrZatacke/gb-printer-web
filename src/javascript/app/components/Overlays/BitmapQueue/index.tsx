import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import ImportPreviewImage from '../../ImportPreviewImage';
import { Actions } from '../../../store/actions';
import SVG from '../../SVG';
import './index.scss';
import Select from '../Confirm/fields/Select';
import moveBitmapsToImport from './moveBitmapsToImport';
import { State } from '../../../store/State';

interface ImportContrast {
  name: string,
  baseValues: number[],
  value: string,
}

const contrasts: ImportContrast[] = [
  {
    name: 'Wider',
    baseValues: [0x00, 0x44, 0xBB, 0xFF],
    value: 'wider',
  },
  {
    name: 'Wide',
    baseValues: [0x00, 0x55, 0xAA, 0xFF],
    value: 'wide',
  },
  {
    name: 'Normal',
    baseValues: [0x33, 0x66, 0x99, 0xCC],
    value: 'normal',
  },
  {
    name: 'Narrow',
    baseValues: [0x45, 0x73, 0xA2, 0xD0],
    value: 'narrow',
  },
  {
    name: 'Narrower',
    baseValues: [0x55, 0x71, 0x8D, 0xAA],
    value: 'narrower',
  },
  {
    // Using src/assets/images/greys.png for reference
    name: 'From Emulator',
    baseValues: [0x40, 0x90, 0xE0, 0xFF],
    value: 'emulator',
  },
];

const BitmapQueue = () => {
  const bitmapQueue = useSelector((state: State) => state.bitmapQueue);
  const dispatch = useDispatch();
  const [dither, setDither] = useState(true);
  const [contrast, setContrast] = useState('wide'); // 'wide' covers the complete greyscale range from 00 tro FF. The thresholds are optimal for already dithered imports

  const contrastBaseValues = (contrasts.find(({ value }) => (value === contrast)) || contrasts[1]).baseValues;

  const dispatchBitmapsToImport = moveBitmapsToImport(dispatch);

  return (
    <Lightbox
      className="bitmap-import-overlay"
      header="Prepare Bitmaps for import"
      confirm={() => {
        dispatchBitmapsToImport({
          bitmapQueue,
          dither,
          contrastBaseValues,
        });
      }}
      deny={() => {
        dispatch({ type: Actions.BITMAPQUEUE_CANCEL });
      }}
    >
      <div
        className="bitmap-import-overlay__content"
      >
        {
          bitmapQueue.map((image, index) => (
            <ImportPreviewImage
              key={index}
              imageData={image.imageData}
              scaleFactor={image.scaleFactor}
              width={image.width}
              height={image.height}
              fileName={image.fileName}
              dither={dither}
              contrastBaseValues={contrastBaseValues}
              palette={['#ffffff', '#aaaaaa', '#555555', '#000000']}
            />
          ))
        }
        <label
          className={
            classnames('bitmap-import-overlay__dither-check', {
              'bitmap-import-overlay__dither-check--checked': dither,
            })
          }
        >
          <input
            type="checkbox"
            className="bitmap-import-overlay__dither"
            checked={dither}
            onChange={({ target }) => {
              setDither(target.checked);
            }}
          />
          <SVG name="checkmark" />
          <span className="bitmap-import-overlay__dither-text">
            Enable Dither
          </span>
        </label>
        <Select
          id="contasts"
          label="Contrast preset"
          options={contrasts}
          setSelected={setContrast}
          value={contrast}
          disabled={false}
        />
      </div>
    </Lightbox>
  );
};

export default BitmapQueue;
