const fs = require('fs');
const path = require('path');
const { paramCase } = require('param-case');
const flatten = require('flatten');
const isCssLength = require('is-css-length');
const isColor = require('is-color');

const toVariableName = paramCase;

const toVariableValue = (value) => {
  switch (typeof value) {
    case 'number':
      return value;
    case 'boolean':
      return value ? 'true' : 'false';
    default:
    case 'string':
      return (isCssLength(value) || isColor(value)) ? value : `'${value.toString().replace(/'/g, '\'')}'`;
  }
};

const toKeyValue = (key, value, prefix = '') => {
  const propName = `${prefix}-${key}`;

  if (value === null || value === undefined) {
    return {
      key: propName,
      value: 0,
    };
  }

  switch (typeof value) {
    case 'object':
      return (
        Object.keys(value).map((key2) => (
          toKeyValue(key2, value[key2], propName)
        ))
      );
    default:
      return {
        key: propName,
        value,
      };
  }
};

const index = ({ config = {}, outFile = path.join(__dirname, '.tmp.scss') }) => {

  const properties = flatten(
    Object.keys(config).map((key) => {
      const value = config[key];
      return toKeyValue(key, value);
    }),
  )
    .map(({ key, value }) => (
      `$${toVariableName(key)}: ${toVariableValue(value)};`
    ));

  fs.writeFileSync(outFile, properties.join('\n'), { encoding: 'utf8' });

  return outFile;
};


module.exports = index;
