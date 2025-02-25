import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import { usePathSegments } from '../../../hooks/usePathSegments';
import useEditStore from '../../stores/editStore';
import Select from '../Overlays/Confirm/fields/Select';
import SVG from '../SVG';

import './index.scss';

function FolderNavi() {
  const navigate = useNavigate();
  const { path: currentPath } = useGalleryParams();
  const { pathsOptions } = useGalleryTreeContext();
  const { setEditImageGroup } = useEditStore();
  const { segments } = usePathSegments();

  if (pathsOptions.length < 2) {
    return null;
  }

  return (
    <div className="folder-navi">
      <ul className="folder-navi__segments">
        { segments.map(({ group, pagedPath }, index) => (
          <li
            key={group.id}
            className="folder-navi__entry"
          >
            <Link
              className="folder-navi__link"
              to={`/gallery/${pagedPath}`}
            >
              { group.title }
            </Link>
            { index > 0 && (
              <button
                type="button"
                className="folder-navi__edit-button"
                onClick={() => setEditImageGroup({ groupId: group.id })}
                title={`Edit group "${group.title}"`}
              >
                <SVG
                  name="edit"
                  className="folder-navi__edit-icon"
                />
              </button>
            ) }
          </li>
        )) }
      </ul>
      <Select
        id="paths"
        label="Your current location"
        options={pathsOptions}
        setSelected={(path) => navigate(`/gallery/${path}page/1`)}
        value={currentPath}
        disabled={false}
      />
    </div>
  );
}

export default FolderNavi;
