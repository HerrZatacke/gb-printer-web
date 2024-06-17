import React from 'react';
import { SpecialTags } from '../../../consts/SpecialTags';

interface Props {
  tags: string[]
}

const TagsList = ({ tags }: Props) => (
  <ul className="gallery-image__tags">
    { tags
      .sort((a, b) => (
        a.toLowerCase().localeCompare(b.toLowerCase())
      ))
      .map((tag) => (
        <li
          key={tag}
          title={tag === SpecialTags.FILTER_FAVOURITE ? 'Favourite' : tag}
          className="gallery-image__tag"
        >
          {tag === SpecialTags.FILTER_FAVOURITE ? '❤️' : tag}
        </li>
      ))}
  </ul>
);

export default TagsList;
