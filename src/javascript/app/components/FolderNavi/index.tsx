import React from 'react';
import { Link } from 'react-router-dom';
import { useGalleryParams } from '../../../hooks/useGalleryParams';

import './index.scss';

interface Segment {
  label: string,
  path: string,
}

function FolderNavi() {
  const { path: currentPath } = useGalleryParams();

  const segments = currentPath
    .split('/')
    .reduce((acc: Segment[], segment: string): Segment[] => (
      segment ? [
        ...acc,
        {
          label: segment,
          path: acc.map(({ label }) => label).concat(segment).join('/'),
        },
      ] : acc
    ), []);

  return (
    <ul className="folder-navi">
      <li
        className="folder-navi__entry"
      >
        <Link
          className="folder-navi__link"
          to="/gallery/page/1"
        >
          [root]
        </Link>
      </li>
      { segments.map(({ label, path }) => (
        <li
          key={path}
          className="folder-navi__entry"
        >
          <Link
            className="folder-navi__link"
            to={`/gallery/${path}/page/1`}
          >
            { label }
          </Link>
        </li>
      )) }
    </ul>
  );
}

export default FolderNavi;
