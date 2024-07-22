import { useEffect, useState } from 'react';

export interface ScreenDimensions {
  ddpx: number,
  width: number,
  height: number,
  layoutWidth: number,
}

const getLayoutWidth = (windowWidth: number): number => {
  const layoutPadding = 40;

  if (windowWidth > 1195 + 25) {
    return 1195 - layoutPadding;
  }

  if (windowWidth > 1000 + 25) {
    return 1000 - layoutPadding;
  }

  if (windowWidth > 805 + 25) {
    return 805 - layoutPadding;
  }

  if (windowWidth > 610 + 25) {
    return 610 - layoutPadding;
  }

  if (windowWidth > 415 + 25) {
    return 415 - layoutPadding;
  }

  return windowWidth - layoutPadding;
};

const getScreenDimensions = (): ScreenDimensions => ({
  width: window.innerWidth,
  height: window.innerHeight,
  ddpx: window.devicePixelRatio,
  layoutWidth: getLayoutWidth(window.innerWidth),
});

export const useScreenDimensions = (): ScreenDimensions => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(getScreenDimensions());

  useEffect(() => {
    const resizeHandler = () => {
      setDimensions(getScreenDimensions());
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [setDimensions]);

  return dimensions;
};
