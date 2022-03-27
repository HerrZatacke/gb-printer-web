import { useHistory } from 'react-router-dom';
import { useEffect, useRef } from 'react';


const useScrolling = () => {
  const history = useHistory();
  const scrollPositions = useRef({});

  useEffect(() => {
    const scrollListener = () => {
      scrollPositions.current[history.location.pathname] = window.scrollY;
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  });

  useEffect(() => (
    history.listen((location) => {
      const scrollPos = scrollPositions.current[location.pathname] || 0;
      window.setImmediate(() => {
        window.scroll(0, scrollPos);
      });
    })
  ), [history]);
};

export default useScrolling;
