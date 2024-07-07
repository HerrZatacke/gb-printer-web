import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import Select from '../Overlays/Confirm/fields/Select';
import { Actions } from '../../store/actions';
import type { DialogOption } from '../../../../types/Dialog';
import type { EditImageGroupAction } from '../../../../types/actions/GroupActions';

import './index.scss';
import SVG from '../SVG';

interface Segment {
  groupId: string,
  label: string,
  path: string,
}

function FolderNavi() {
  const navigate = useNavigate();
  const { path: currentPath } = useGalleryParams();
  const { paths } = useGalleryTreeContext();
  const dispatch = useDispatch();

  const segments = useMemo<Segment[]>(() => (
    currentPath
      .split('/')
      .reduce((acc: Segment[], segment: string): Segment[] => {
        if (!segment) {
          return acc;
        }

        const path = acc.map(({ label }) => label)
          .concat(segment, '') // the empty string creates the trailing '/'
          .join('/');

        const groupId = paths.find(({ absolutePath }) => absolutePath === path)?.group.id || '';

        if (!groupId) {
          return acc;
        }

        return [
          ...acc,
          {
            groupId,
            label: segment,
            path,
          },
        ];
      }, [])
  ), [currentPath, paths]);

  const options: DialogOption[] = paths.reduce((acc: DialogOption[], { group, absolutePath }): DialogOption[] => {
    const depth = absolutePath.split('/').length - 1;
    const indent = Array(depth).fill('\u2007').join('');

    return [
      ...acc,
      {
        value: absolutePath,
        name: `${indent}${group.title} (/${absolutePath.replace(/\/$/, '')})`,
      },
    ];
  }, []);

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
        { segments.map(({ label, path, groupId }) => (
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
            <button
              type="button"
              className="folder-navi__edit-button"
              onClick={() => {
                dispatch<EditImageGroupAction>({
                  type: Actions.EDIT_IMAGE_GROUP,
                  payload: {
                    groupId,
                  },
                });
              }}
            >
              <SVG
                name="edit"
                className="folder-navi__edit-icon"
              />
            </button>
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
