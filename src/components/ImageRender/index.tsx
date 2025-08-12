import React from 'react';
import { useImageDimensions } from '@/hooks/useImageDimensions';
import { type Overrides, useImageRender } from '@/hooks/useImageRender';
import GameBoyImage from '../GameBoyImage';
import ImageLoading from '../ImageLoading';

interface Props {
  hash: string,
  asThumb?: boolean,
  overrides?: Overrides,
}

function ImageRender({ hash, asThumb, overrides }: Props) {
  const { gbImageProps } = useImageRender(hash, overrides);
  const { dimensions } = useImageDimensions(hash);

  return gbImageProps ? (
    <GameBoyImage
      { ...gbImageProps }
      asThumb={asThumb}
      dimensions={dimensions}
    />
  ) : (
    <ImageLoading dimensions={dimensions} />
  );
}

export default ImageRender;
