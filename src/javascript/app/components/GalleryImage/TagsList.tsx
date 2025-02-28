import React from 'react';
import classnames from 'classnames';
import { specialTags, SpecialTags } from '../../../consts/SpecialTags';

interface Props {
  tags: string[],
  fromGroup?: boolean,
}


const sortTags = (a: string, b: string) => (
  a.toLowerCase().localeCompare(b.toLowerCase())
);


function TagsList({ tags, fromGroup }: Props) {

  let showTags: string[];
  let moreTags: string[] = [];

  if (fromGroup) {
    const groupOnly = tags.sort(sortTags).filter((groupTag) => (
      !specialTags.includes(groupTag)
    ));

    showTags = groupOnly.slice(0, 3);
    moreTags = groupOnly.slice(3, -1);
  } else {
    showTags = tags;
  }

  return (
    <ul className="gallery-image__tags">
      { showTags
        .sort(sortTags)
        .map((tag) => (
          <li
            key={tag}
            title={tag === SpecialTags.FILTER_FAVOURITE ? 'Favourite' : tag}
            className={classnames('gallery-image__tag', {
              'gallery-image__tag--group': fromGroup,
            })}
          >
            {tag === SpecialTags.FILTER_FAVOURITE ? '❤️' : tag}
          </li>
        ))}

      {
        moreTags.length > 0 && (
          <li
            title={`+${moreTags.length} more tags:\n${moreTags.join('\n')}`}
            className={classnames('gallery-image__tag', {
              'gallery-image__tag--group': fromGroup,
            })}
          >
            {`+${moreTags.length} more`}
          </li>
        )
      }
    </ul>
  );
}

export default TagsList;
