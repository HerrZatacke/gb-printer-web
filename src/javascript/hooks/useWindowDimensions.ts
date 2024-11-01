import { useEffect, useState } from 'react';

interface UseWindowDimensions {
  width: number,
  height: number,
}

export const useWindowDimensions = (): UseWindowDimensions => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const updateDimensions = () => {
    setWidth(window.innerHeight);
    setHeight(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return { width, height };
};
