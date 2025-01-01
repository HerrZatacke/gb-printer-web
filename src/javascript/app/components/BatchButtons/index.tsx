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

const BATCH_ACTIONS_MONOCHROME: BatchActionType[] = [
  BatchActionType.RGB,
];

const batchActionTitle = (id: BatchActionType) => {
  switch (id) {
    case BatchActionType.DELETE:
      return 'Delete';
    case BatchActionType.ANIMATE:
      return 'Animate';
    case BatchActionType.DOWNLOAD:
      return 'Download';
    case BatchActionType.EDIT:
      return 'Edit';
    case BatchActionType.RGB:
      return 'Create RGB Images';
    default:
      return '';
  }
};


interface Props {
  page: number,
}

function BatchButtons({ page }: Props) {

  const {
    hasPlugins,
    batchEnabled,
    monochromeBatchEnabled,
    activeFilters,
    selectedImageCount,
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
          title="Sort"
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
          title="Manage Filters"
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
          title={hasSelected ? 'Uncheck All' : 'Check All'}
        >
          <SVG name="checkmark" />
          {selectedImageCount === 0 ? null : (
            <span className="batch-buttons__bubble">{selectedImageCount}</span>
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
              title={batchActionTitle(action)}
            >
              <SVG name={action} />
            </button>
          </li>
        ))
      }
      {
        BATCH_ACTIONS_MONOCHROME.map((action) => (
          <li
            key={action}
            className={
              classnames('gallery-button', {
                'gallery-button--disabled': !monochromeBatchEnabled,
                'gallery-button--enabled': monochromeBatchEnabled,
              })
            }
          >
            <button
              disabled={!monochromeBatchEnabled}
              type="button"
              onClick={() => batchTask(action)}
              title={batchActionTitle(action)}
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
              title="Use Plugin"
            >
              <SVG name="plug" />
            </button>
          </PluginSelect>
        </li>
      ) : null}
    </ul>
  );
}

export default BatchButtons;
