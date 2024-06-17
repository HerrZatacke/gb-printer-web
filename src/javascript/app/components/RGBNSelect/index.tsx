import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import { useRGBNImage } from './useRGBNImage';
import { RGBNHashes } from '../../../../types/Image';

import './index.scss';

interface RGBNCheckbox {
  value: boolean,
  cssModifier: string,
  updateKey: keyof RGBNHashes,
}

interface Props {
  hash: string,
}

const RGBNSelect = ({ hash }: Props) => {
  const { isR, isG, isB, isN, updateRGBN } = useRGBNImage(hash);

  const BOXES: RGBNCheckbox[] = [
    {
      value: isR,
      cssModifier: 'red',
      updateKey: 'r',
    },
    {
      value: isG,
      cssModifier: 'green',
      updateKey: 'g',
    },
    {
      value: isB,
      cssModifier: 'blue',
      updateKey: 'b',
    },
    {
      value: isN,
      cssModifier: 'normal',
      updateKey: 'n',
    },
  ];

  return (
    <div
      className="rgbn-select"
      onClick={(ev) => {
        ev.stopPropagation();
      }}
      role="presentation"
    >
      {
        BOXES.map(({
          value,
          cssModifier,
          updateKey,
        }) => (
          <button
            type="button"
            key={updateKey}
            className={
              classnames(`rgbn-select__button rgbn-select__button--${cssModifier}`, {
                'rgbn-select__button--selected': value,
              })
            }
            onClick={() => {
              updateRGBN(updateKey, !value);
            }}
          >
            <SVG name="circle" />
          </button>
        ))
      }
    </div>
  );
};

export default RGBNSelect;
