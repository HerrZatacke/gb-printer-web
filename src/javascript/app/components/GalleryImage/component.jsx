import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNSelect from '../RGBNSelect';
import { dateFormat } from '../../defaults';
import dateFormatLocale from '../../../tools/dateFormatLocale';
import ImageRender from '../ImageRender';
import { FILTER_FAVOURITE } from '../../../consts/specialTags';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

const GalleryImage = ({
  hideDate,
  created,
  updateImageSelection,
  isSelected,
  page,
  editImage,
  lockFrame,
  invertPalette,
  palette,
  frame,
  title,
  tags,
  isFavourite,
  hash,
  hashes,
  type,
  preferredLocale,
  meta,
  rotation,
}) => {

  const getDateSpan = (className) => {
    if (hideDate || !created) {
      return null;
    }

    return (
      <span className={className}>
        { dateFormatLocale(dayjs(created, dateFormat), preferredLocale) }
      </span>
    );
  };

  const getTagsList = () => (
    <ul className="gallery-image__tags">
      {
        tags
          .sort((a, b) => (
            a.toLowerCase().localeCompare(b.toLowerCase())
          ))
          .map((tag) => (
            <li
              key={tag}
              title={tag === FILTER_FAVOURITE ? 'Favourite' : tag}
              className="gallery-image__tag"
            >
              {tag === FILTER_FAVOURITE ? '❤️' : tag}
            </li>
          ))
      }
    </ul>
  );

  const handleCellClick = (ev) => {
    if (ev.ctrlKey || ev.shiftKey) {
      ev.preventDefault();
      updateImageSelection(isSelected ? 'remove' : 'add', ev.shiftKey, page);
    } else {
      editImage();
    }
  };

  return type === 'default' ? (
    <li
      className={
        classnames('gallery-image', {
          'gallery-image--selected': isSelected,
        })
      }
      onClick={handleCellClick}
      role="presentation"
    >
      <div className="gallery-image__image">
        <ImageRender
          lockFrame={lockFrame}
          invertPalette={invertPalette}
          palette={palette.palette || palette}
          frameId={frame}
          hash={hash}
          hashes={hashes}
          rotation={rotation}
        />
      </div>
      {title ? (
        <span
          className="gallery-image__title"
        >
          {title}
        </span>
      ) : null}
      { getTagsList() }
      <div className="gallery-image__created-meta">
        {(
          meta ? (
            <>
              <div className="gallery-image__meta">
                <SVG name="meta" />
              </div>
              <pre className="gallery-image__meta-pre">
                { JSON.stringify(meta, null, 2) }
              </pre>
            </>
          ) : null
        )}
        {getDateSpan('gallery-image__created')}
      </div>
      <GalleryImageButtons
        isFavourite={isFavourite}
        hash={hash}
        buttons={['select', 'favourite', 'download', 'delete', 'view', 'share', 'plugins']}
      />
    </li>
  ) : (
    <li
      className={
        classnames('gallery-list-image', {
          'gallery-list-image--selected': isSelected,
        })
      }
      onClick={handleCellClick}
      role="presentation"
    >
      <div className="gallery-list-image__cell gallery-list-image__cell-image">
        <div className="gallery-list-image__image">
          <div className="gallery-list-image__image--scale">
            <ImageRender
              lockFrame={lockFrame}
              invertPalette={invertPalette}
              palette={palette.palette || palette}
              frameId={frame}
              hash={hash}
              hashes={hashes}
              rotation={rotation}
            />
          </div>
        </div>
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-description">
        <div className="gallery-list-image__description">
          <span className="gallery-list-image__title">
            {title}
          </span>
          {getDateSpan('gallery-list-image__created')}
        </div>
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-tags">
        { getTagsList() }
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-rgbn">
        { hashes ? null : (
          <RGBNSelect hash={hash} />
        )}
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-buttons">
        <GalleryImageButtons
          isFavourite={isFavourite}
          hash={hash}
          buttons={['select', 'favourite', 'download', 'delete', 'view', 'plugins']}
        />
      </div>
    </li>
  );
};

GalleryImage.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.object.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  lockFrame: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFavourite: PropTypes.bool.isRequired,
  editImage: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['list', 'default']).isRequired,
  isSelected: PropTypes.bool.isRequired,
  updateImageSelection: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  hideDate: PropTypes.bool.isRequired,
  preferredLocale: PropTypes.string,
  meta: PropTypes.object,
  rotation: PropTypes.number,
};

GalleryImage.defaultProps = {
  created: null,
  hashes: null,
  frame: null,
  preferredLocale: null,
  meta: null,
  rotation: 0,
};

export default GalleryImage;
