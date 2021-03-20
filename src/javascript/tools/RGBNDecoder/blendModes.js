const blendModeKeys = {
  MULTIPLY: 'mult',
};

const blendModeFunctions = {
  [blendModeKeys.MULTIPLY]: ({ r, g, b, n }) => ({
    r: r * n / 0xff,
    g: g * n / 0xff,
    b: b * n / 0xff,
  }),
};

const blendModeLabels = {
  [blendModeKeys.MULTIPLY]: 'Multiply',
};


export {
  blendModeKeys,
  blendModeFunctions,
  blendModeLabels,
};
