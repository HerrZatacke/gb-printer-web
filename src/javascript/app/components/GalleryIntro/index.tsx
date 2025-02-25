import React from 'react';
import bytes from 'bytes';
import type { CSSPropertiesVars } from 'react';
import { useStorageInfo } from './useStorageInfo';
import './index.scss';

interface Props {
  imageCount: number,
  selectedCount: number,
  filteredCount: number,
}

const storageLabel = (key: string) => {
  switch (key) {
    case 'indexedDB':
      return 'indexed DB';
    case 'localStorage':
      return 'local storage';
    default:
      return key;
  }
};

function GalleryIntroText(props: Props) {
  const { storageEstimate } = useStorageInfo();
  return (
    <>
      <h2 className="gallery-intro__counter">
        {`${props.imageCount} images`}
        { props.filteredCount ? ` / ${props.filteredCount} filtered` : null}
        { props.selectedCount ? ` / ${props.selectedCount} selected` : null}
      </h2>
      <p className="gallery-intro__content-hint">
        These images are stored in the localStorage of your browser.
        That&apos;s why you (currently) cannot share a link to one of them.
        <br />
        Also if you clear your browser&apos;s cookies, the images will be gone too.
      </p>
      {
        storageEstimate && (
          <p
            key={storageEstimate.type}
            className="gallery-intro__storage-limit"
            style={{
              '--percentage': `${storageEstimate.percentage}%`,
            } as CSSPropertiesVars}
            title={`Using ${bytes(storageEstimate.used)} of ${bytes(storageEstimate.total)}`}
          >
            { `You are using ${storageEstimate.percentage}% of your browser's ${storageLabel(storageEstimate.type)}. Be aware for now saving images will not be possible once you hit the limit.` }
          </p>
        )
      }
    </>
  );
}

export default GalleryIntroText;
