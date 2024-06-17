import React from 'react';
import Lightbox from '../../Lightbox';
import FilterFormTag from './filterFormTag';
import { SpecialTags } from '../../../../consts/SpecialTags';
import { useFilterForm } from './useFilterForm';

import './index.scss';

function FilterForm() {

  const {
    visible,
    availableTags,
    activeTags,
    updateActiveTags,
    clearTags,
    confirm,
    cancel,
  } = useFilterForm();

  if (!visible) {
    return null;
  }

  return (
    <Lightbox
      className="filter-form"
      confirm={confirm}
      deny={cancel}
      header="Select Filters"
    >
      <span
        className="filter-form__hint"
      >
        If set, all must be met
      </span>
      <ul
        className="filter-form__tag-list"
      >
        <FilterFormTag
          title="Untagged"
          tagActive={activeTags.includes(SpecialTags.FILTER_UNTAGGED)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_UNTAGGED, active)}
        />
        <FilterFormTag
          title="❤️ Favourite"
          tagActive={activeTags.includes(SpecialTags.FILTER_FAVOURITE)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_FAVOURITE, active)}
        />
        <FilterFormTag
          title="New"
          tagActive={activeTags.includes(SpecialTags.FILTER_NEW)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_NEW, active)}
        />
        <FilterFormTag
          title="Monochrome"
          tagActive={activeTags.includes(SpecialTags.FILTER_MONOCHROME)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_MONOCHROME, active)}
        />
        <FilterFormTag
          title="RGB"
          tagActive={activeTags.includes(SpecialTags.FILTER_RGB)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RGB, active)}
        />
        <FilterFormTag
          title="Recent Imports"
          tagActive={activeTags.includes(SpecialTags.FILTER_RECENT)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RECENT, active)}
        />
        <FilterFormTag
          title="Image has comments"
          tagActive={activeTags.includes(SpecialTags.FILTER_COMMENTS)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_COMMENTS, active)}
        />
        <FilterFormTag
          title="Image has username"
          tagActive={activeTags.includes(SpecialTags.FILTER_USERNAME)}
          toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_USERNAME, active)}
        />
      </ul>
      <ul
        className="filter-form__tag-list filter-form__tag-list--clear"
      >
        <FilterFormTag
          title="Clear Filters"
          tagActive={false}
          icon="delete"
          toggleTag={clearTags}
        />
      </ul>
      <span
        className="filter-form__hint"
      >
        If set, one must be met
      </span>
      <ul
        className="filter-form__tag-list"
      >
        {availableTags.map((tag) => (
          <FilterFormTag
            key={tag}
            title={tag}
            tagActive={activeTags.includes(tag)}
            toggleTag={(active) => updateActiveTags(tag, active)}
          />
        ))}
      </ul>
    </Lightbox>
  );
}

export default FilterForm;
