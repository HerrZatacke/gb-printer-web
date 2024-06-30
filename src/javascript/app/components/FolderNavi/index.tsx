import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import Select from '../Overlays/Confirm/fields/Select';
import type { DialogOption } from '../../../../types/Dialog';

import './index.scss';

interface Segment {
  label: string,
  path: string,
}

function FolderNavi() {
  const navigate = useNavigate();
  const { path: currentPath } = useGalleryParams();
  const { paths } = useGalleryTreeContext();

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

  const options: DialogOption[] = Object.keys(paths).map((path) => {
    const group = paths[path];
    const depth = path.split('/').length - 1;
    const indent = Array(depth).fill('\u2007').join('');

    return ({
      value: path,
      name: `${indent}${group.title} (/${path.replace(/\/$/, '')})`,
    });
  });

  if (!options.length) {
    return null;
  }

  options.unshift({
    value: '/',
    name: '/',
  });

  return (
    <div className="folder-navi">
      <ul className="folder-navi__segments">
        <li
          className="folder-navi__entry"
        >
          <Link
            className="folder-navi__link"
            to="/gallery/page/1"
          >
            🏠
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
      <Select
        id="paths"
        label="Your current location"
        options={options}
        setSelected={(path) => navigate(`/gallery/${path}page/1`)}
        value={currentPath}
        disabled={false}
      />
    </div>
  );
}

export default FolderNavi;
