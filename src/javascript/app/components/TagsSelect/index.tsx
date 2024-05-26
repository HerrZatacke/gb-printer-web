import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import InputNewTag from './InputNewTag';
import unique from '../../../tools/unique';
import { SpecialTags } from '../../../consts/SpecialTags';
import './index.scss';
import { TagChange } from '../../../tools/applyTagChanges';
import { TagUpdateMode } from '../../../tools/modifyTagChanges';

interface Props {
  label?: string,
  tags: TagChange
  updateTags: (mode: TagUpdateMode, tag: string) => void,
  listDirection?: string,
}

const TagsSelect = ({
  label,
  tags,
  updateTags,
  listDirection,
}: Props) => {
  const activeTags = unique([...tags.initial, ...tags.add]);

  return (
    <>
      {(
        label ? (
          <label
            className="tags-select__label"
            htmlFor="tags-select-new-tag"
          >
            { label }
          </label>
        ) : null
      )}
      <ul className="tags-select">
        {
          activeTags.map((tag) => (
            <li
              className={
                classnames('tags-select__tag', {
                  'tags-select__tag--add': tags.add.includes(tag),
                  'tags-select__tag--remove': tags.remove.includes(tag),
                })
              }
              key={tag}
            >
              <span
                className="tags-select__tag-name"
              >
                {tag === SpecialTags.FILTER_FAVOURITE ? '❤️' : tag}
              </span>
              <button
                type="button"
                className="tags-select__button tags-select__button--remove"
                onClick={() => updateTags(TagUpdateMode.REMOVE, tag)}
              >
                <SVG name="remove" />
              </button>
              <button
                type="button"
                className="tags-select__button tags-select__button--add"
                onClick={() => updateTags(TagUpdateMode.ADD, tag)}
              >
                <SVG name="add" />
              </button>
            </li>
          ))
        }
        <InputNewTag
          updateTags={updateTags}
          selectedTags={activeTags}
          direction={listDirection}
        />
      </ul>
    </>
  );
};

export default TagsSelect;
