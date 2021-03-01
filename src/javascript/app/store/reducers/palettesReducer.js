import uniqueBy from '../../../tools/unique/by';

const palettesReducer = (value = [], action) => {
  switch (action.type) {
    case 'PALETTE_DELETE':
      return [...value.filter(({ shortName }) => shortName !== action.payload)];
    case 'PALETTE_ADD':
      return uniqueBy('shortName')([...value, action.payload]);
    case 'GLOBAL_UPDATE':
      return uniqueBy('shortName')(action.payload.palettes, ...value);
    default:
      return value;
  }
};

export default palettesReducer;
