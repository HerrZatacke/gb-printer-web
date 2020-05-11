const palettesReducer = (value = [], action) => {
  switch (action.type) {
    case 'PALETTE_DELETE':
      return [...value.filter(({ shortName }) => shortName !== action.payload)];
    case 'PALETTE_ADD':
      return [...value, action.payload];
    default:
      return value;
  }
};

export default palettesReducer;
