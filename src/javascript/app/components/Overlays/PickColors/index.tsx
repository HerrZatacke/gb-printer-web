import type { CSSProperties } from 'react';
import React, { useMemo, useState } from 'react';
import useEditStore from '../../../stores/editStore';
import useFiltersStore from '../../../stores/filtersStore';
import useItemsStore from '../../../stores/itemsStore';
import Lightbox from '../../Lightbox';
import { NEW_PALETTE_SHORT } from '../../../../consts/SpecialTags';
import { toHexColor } from '../../../../hooks/usePaletteFromFile';
import ImageRender from '../../ImageRender';
import getGetPreviewImages from '../../../../tools/getPreviewImages';
import './index.scss';

function PickColors() {
  const { images } = useItemsStore();
  const {
    imageSelection,
    sortBy,
    filtersActiveTags,
    recentImports,
  } = useFiltersStore();

  const { pickColors, setEditPalette, cancelEditPalette, cancelPickColors } = useEditStore();

  const [selected, setSelected] = useState<number[]>([0, 3, 6, 9]);
  const getPreviewImages = getGetPreviewImages(images, { sortBy, filtersActiveTags, recentImports }, imageSelection);

  const palette = useMemo<string[]>((): string[] => {
    if (!pickColors) {
      return [];
    }

    return Array(4)
      .fill(null)
      .map((_, index): string => {

        const selectedIndex = selected[index];
        const color = pickColors.colors[selectedIndex];
        return color ? toHexColor(color) : '#000000';
      });
  }, [pickColors, selected]);

  const previewImages = useMemo(() => getPreviewImages(), [getPreviewImages]);

  if (!pickColors) {
    return null;
  }

  const updateSelectedIndices = (changeIndex: number): void => {
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

  const getSelectionIndex = (colorIndex: number) => {
    const selectionIndex = selected.findIndex((selectedIndex) => selectedIndex === colorIndex);
    return selectionIndex + 1;
  };

  return (
    <Lightbox
      className="pick-colors"
      confirm={() => {
        setEditPalette({
          name: `From file ${pickColors.fileName}`,
          shortName: NEW_PALETTE_SHORT,
          palette,
          origin: 'generated from file',
          isPredefined: false,
        });
      }}
      canConfirm={selected.length === 4}
      deny={() => {
        cancelPickColors();
        cancelEditPalette();
      }}
      header={`Pick colors from "${pickColors.fileName}"`}
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
                  invertFramePalette={false}
                  lockFrame={false}
                  palette={palette}
                  framePalette={palette}
                />
              </li>
            ))
          }
        </ul>
        <ul className="pick-colors__list">
          { pickColors.colors.map((rgb, colorIndex) => {
            const selectionIndex = getSelectionIndex(colorIndex);
            return (
              <li
                key={colorIndex}
                className="pick-colors__item"
                style={{
                  '--color': `rgb(${rgb.join(',')})`,
                } as CSSProperties}
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
}

export default PickColors;
