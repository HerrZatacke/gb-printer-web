import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import './index.scss';
import { CANCEL_PICK_COLORS, SET_EDIT_PALETTE } from '../../../store/actions';
import { NEW_PALETTE_SHORT } from '../../../../consts/specialTags';
import { toHexColor } from '../../../../hooks/usePaletteFromFile';
import ImageRender from '../../ImageRender';
import getGetPreviewImages from '../../../../tools/getPreviewImages';

const PickColors = () => {
  const state = useSelector((s) => s);
  const { pickColors: { colors, fileName } } = state;
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([0, 3, 6, 9]);
  const getPreviewImages = getGetPreviewImages(state);

  const updateSelectedIndices = (changeIndex) => {
    let removedOne = false;
    const newIndices = selected.filter((selectedIndex) => {
      if (selectedIndex === changeIndex) {
        removedOne = true;
        return false;
      }

      return true;
    });

    if (removedOne) {
      setSelected(newIndices);
    } else {
      while (newIndices.length > 3) {
        newIndices.shift();
      }

      setSelected([...newIndices, changeIndex]);
    }
  };

  const getSelectionIndex = (colorIndex) => {
    const selectionIndex = selected.findIndex((selectedIndex) => selectedIndex === colorIndex);
    return selectionIndex + 1;
  };

  const palette = useMemo(() => Array(4).fill(null).map((_, index) => {
    const selectedIndex = selected[index];
    const color = colors[selectedIndex];
    return color ? toHexColor(color) : '#000000';
  }), [colors, selected]);

  const previewImages = useMemo(() => getPreviewImages(), [getPreviewImages]);

  return (
    <Lightbox
      className="pick-colors"
      confirm={() => {
        dispatch({
          type: SET_EDIT_PALETTE,
          payload: {
            name: `From file ${fileName}`,
            shortName: NEW_PALETTE_SHORT,
            palette,
            origin: 'generated from file',
          },
        });
      }}
      canConfirm={selected.length === 4}
      deny={() => {
        dispatch({ type: CANCEL_PICK_COLORS });
      }}
      header={`Pick colors from "${fileName}"`}
    >
      <>
        <ul className="edit-palette__previews">
          {
            previewImages.map((image) => (
              <li
                className="edit-palette__preview-image"
                key={image.hash}
              >
                <ImageRender
                  hash={image.hash}
                  invertPalette={false}
                  lockFrame={false}
                  palette={palette}
                />
              </li>
            ))
          }
        </ul>
        <ul className="pick-colors__list">
          { colors.map((rgb, colorIndex) => {
            const selectionIndex = getSelectionIndex(colorIndex);
            return (
              <li
                key={colorIndex}
                className="pick-colors__item"
                style={{
                  '--color': `rgb(${rgb.join(',')})`,
                }}
              >
                <button
                  type="button"
                  className="pick-colors__button"
                  onClick={() => updateSelectedIndices(colorIndex)}
                >
                  {
                    selectionIndex ? (
                      <span className="pick-colors__index">{selectionIndex}</span>
                    ) : null
                  }
                </button>
              </li>
            );
          }) }
        </ul>
        <div className="pick-colors__preview">
          { palette.map((color, index) => (
            <div
              key={index}
              className="pick-colors__preview-item"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </>
    </Lightbox>
  );
};

export default PickColors;
