import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage/component';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';

const getTiles = ({ id, name }) => {
  const text = `\n  ID: ${id}\n\n  ${name}`;
  return applyFrame(textToTiles(text), id);
};

const Frame = ({ id, name, palette }) => {
  const [tiles, setTiles] = useState(null);

  useEffect(() => {
    let mounted = true;
    getTiles({
      id,
      name,
    }).then((t) => {
      if (mounted) {
        setTiles(t);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id, name]);

  if (!tiles) {
    return null;
  }

  return (
    <GameBoyImage
      lockFrame={false}
      invertPalette={false}
      palette={palette}
      tiles={tiles}
    />
  );
};

Frame.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  palette: PropTypes.array.isRequired,
};

export default Frame;
