import { useHistory } from 'react-router-dom';
import { useEffect, useRef } from 'react';


const useScrolling = () => {
  const history = useHistory();
  const scrollPositions = useRef({});

  useEffect(() => {
    const scrollListener = () => {
      let path = history.location.pathname;

      if (path.startsWith('/gallery')) {
        path = '/gallery';
      }

      scrollPositions.current[path] = window.scrollY;

      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(scrollPositions));
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  });

  useEffect(() => (
    history.listen((location) => {
      if (location.pathname.startsWith('/gallery/page')) {
        return;
      }

      const scrollPos = scrollPositions.current[location.pathname] || 0;
      window.setImmediate(() => {
        window.scroll(0, scrollPos);
      });
    })
  ), [history]);
};

export default useScrolling;
