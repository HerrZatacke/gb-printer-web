import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { ConfigParamType } from '@/consts/plugins';

const inputValueFromType = (type: ConfigParamType, value: string): string | number => {
  switch (type) {
    case ConfigParamType.NUMBER: {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }

    case ConfigParamType.STRING:
    case ConfigParamType.MULTILINE:
      return value || '';

    default:
      return value;
  }
};

const toStringValue = (value?: string | number): string => {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      return value.toString(10) || '0';
    default:
      return '';
  }
};

interface Props {
  id: string,
  label: string,
  type: ConfigParamType,
  value?: string | number,
  onChange: (value: string | number) => void,
}

function PluginInputField({ id, label, type, value, onChange }: Props) {
  const [fieldValue, setFieldValue] = useState<string>(toStringValue(value));

  return (
    <TextField
      id={id}
      label={label}
      type="text"
      multiline={type === ConfigParamType.MULTILINE}
      value={fieldValue}
      onChange={(ev) => {
        setFieldValue(ev.target.value);
      }}
      onBlur={() => {
        setFieldValue(toStringValue(inputValueFromType(type, fieldValue)));
        onChange(inputValueFromType(type, fieldValue));
      }}
    />
  );
}

export default PluginInputField;
