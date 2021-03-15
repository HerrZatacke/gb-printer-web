import uniqueBy from '../../../tools/unique/by';

const palettesReducer = (value = [], action) => {
  switch (action.type) {
    case 'PALETTE_DELETE':
      return [...value.filter(({ shortName }) => shortName !== action.payload.shortName)];
    case 'PALETTE_UPDATE':
      return uniqueBy('shortName')([
        ...value.map((palette) => (
          palette.shortName !== action.payload.shortName ? palette : action.payload
        )),
        action.payload, // append as last one in case it's a new palette (duplicates will be removed by uniqueBy)
      ]);
    case 'GLOBAL_UPDATE':
      return uniqueBy('shortName')(action.payload.palettes, ...value);
    default:
      return value;
  }
};

export default palettesReducer;
