import React, { useState } from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import PluginSelect from '../PluginSelect';
import './index.scss';
import useBatchButtons from './useBatchButtons';
import { BatchActionType } from '../../../consts/batchActionTypes';

const BATCH_ACTIONS: BatchActionType[] = [
  BatchActionType.DOWNLOAD,
  BatchActionType.DELETE,
  BatchActionType.EDIT,
  BatchActionType.ANIMATE,
];

interface Props {
  page: number,
}

const BatchButtons = ({ page }: Props) => {

  const {
    hasPlugins,
    batchEnabled,
    activeFilters,
    selectedImages,
    hasSelected,
    batchTask,
    filter,
    showSortOptions,
  } = useBatchButtons(page);

  const [pluginsActive, setPluginsActive] = useState(false);

  return (
    <ul className="batch-buttons gallery-button__group">
      <li
        className="gallery-button gallery-button--enabled"
      >
        <button
          type="button"
          onClick={showSortOptions}
        >
          <SVG name="sort" />
        </button>
      </li>
      <li
        className="gallery-button gallery-button--enabled"
      >
        <button
          type="button"
          onClick={filter}
        >
          <SVG name="filter" />
          {activeFilters === 0 ? null : (
            <span className="batch-buttons__bubble">{activeFilters}</span>
          )}
        </button>
      </li>
      <li
        className={
          classnames('gallery-button gallery-button--enabled', {
            'gallery-button--has-selected': !hasSelected,
          })
        }
      >
        <button
          type="button"
          onClick={() => batchTask(hasSelected ? BatchActionType.UNCHECKALL : BatchActionType.CHECKALL)}
        >
          <SVG name="checkmark" />
          {selectedImages === 0 ? null : (
            <span className="batch-buttons__bubble">{selectedImages}</span>
          )}
        </button>
      </li>
      {
        BATCH_ACTIONS.map((action) => (
          <li
            key={action}
            className={
              classnames('gallery-button', {
                'gallery-button--disabled': !batchEnabled,
                'gallery-button--enabled': batchEnabled,
              })
            }
          >
            <button
              disabled={!batchEnabled}
              type="button"
              onClick={() => batchTask(action)}
            >
              <SVG name={action} />
            </button>
          </li>
        ))
      }
      {hasPlugins ? (
        <li
          className={
            classnames('gallery-button', {
              'gallery-button--disabled': !batchEnabled,
              'gallery-button--enabled': batchEnabled,
            })
          }
          onMouseLeave={() => setPluginsActive(false)}
        >
          <PluginSelect
            pluginsActive={pluginsActive}
          >
            <button
              type="button"
              onClick={() => setPluginsActive(true)}
            >
              <SVG name="plug" />
            </button>
          </PluginSelect>
        </li>
      ) : null}
    </ul>
  );
};

export default BatchButtons;
