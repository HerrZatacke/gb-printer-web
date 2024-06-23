import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import SVG from '../SVG';

import './index.scss';

const colorIsValid = (color: string) => (
  color.match(/^#[0-9a-f]{6}$/i)
);

export enum InputType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  COLOR = 'color',
  FILE = 'file',
  PASSWORD = 'password',
}

interface Props {
  id: string,
  labelText: string,
  type: InputType,
  min?: number,
  max?: number,
  step?: number,
  value?: string | number,
  onChange?: (value: string) => void,
  onChangeFiles?: (value: File[]) => void,
  onBlur?: () => void,
  buttonOnClick?: () => void,
  buttonIcon?: string,
  buttonLabel?: string,
  onKeyUp?: (key: string) => void,
  disabled?: boolean,
  children?: React.ReactNode,
  autoComplete?: string,
  autoCorrect?: 'on' | 'off',
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters',
  spellCheck?: boolean,
}

function Input({
  id,
  labelText,
  buttonIcon,
  buttonLabel,
  buttonOnClick,
  type,
  min,
  max,
  step,
  value,
  disabled,
  onChange,
  onChangeFiles,
  onBlur,
  onKeyUp,
  children,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  spellCheck,
}: Props) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [colorVal, setColorVal] = useState<string>();

  useEffect(() => {
    if (type === InputType.COLOR) {
      setColorVal(value as string);
    }
  }, [setColorVal, value, type]);

  const keyUpListener = onKeyUp ? (({ key }: React.KeyboardEvent) => onKeyUp(key)) : undefined;

  const blurListener = onBlur ? () => {
    if (type === InputType.PASSWORD) {
      setShowPass(false);
    }

    onBlur();
  } : undefined;

  return (
    <div
      className={`inputgroup inputgroup--${type}`}
    >
      <label
        htmlFor={id}
        className="inputgroup__label"
      >
        {labelText}
        {children}
      </label>
      { type === InputType.TEXTAREA ? (
        <textarea
          id={id}
          className="inputgroup__input inputgroup__input--textarea"
          value={value}
          disabled={disabled}
          onChange={({ target: { value: newVal } }) => (
            onChange && onChange(newVal)
          )}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          onBlur={blurListener}
          onKeyUp={keyUpListener}
        />
      ) : (
        <input
          id={id}
          className="inputgroup__input"
          type={(showPass ? InputType.TEXT : type)}
          min={type === InputType.NUMBER ? min : undefined}
          max={type === InputType.NUMBER ? max : undefined}
          step={type === InputType.NUMBER ? step : undefined}
          value={value}
          disabled={disabled}
          onChange={type === InputType.FILE ? ({ target: { files } }) => (
            files && onChangeFiles && onChangeFiles([...files] as File[])
          ) : ({ target: { value: newVal } }) => (
            onChange && onChange(newVal)
          )}
          multiple={type === InputType.FILE ? true : undefined}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          onBlur={blurListener}
          onKeyUp={keyUpListener}
        />
      )}
      {((type === InputType.FILE) ? (
        <label
          htmlFor={id}
          className="button button--label"
        >
          Select
        </label>
      ) : null)}

      {(buttonOnClick && (buttonIcon || buttonLabel)) ? (
        <button
          type="button"
          className={classnames({
            button: buttonLabel,
            [`inputgroup__button inputgroup__button--${buttonIcon}`]: buttonIcon,
          })}
          onClick={buttonOnClick}
        >
          { buttonIcon ? <SVG name={buttonIcon} /> : buttonLabel }
        </button>
      ) : null}

      {((type === InputType.COLOR) ? (
        <input
          type="text"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={classnames('inputgroup__input inputgroup__input--colortext', {
            'inputgroup__input--invalid-color': !colorVal || !colorIsValid(colorVal),
          })}
          value={colorVal}
          disabled={disabled}
          onChange={({ target: { value: newColorVal } }) => {
            setColorVal(newColorVal);
            if (onChange && colorIsValid(newColorVal)) {
              onChange(newColorVal);
            }
          }}
          onBlur={blurListener}
        />
      ) : null)}

      {(type === InputType.PASSWORD ? (
        <button
          type="button"
          className="inputgroup__button inputgroup__button--show-password"
          onClick={() => setShowPass(!showPass)}
        >
          <SVG name="view" />
        </button>
      ) : null)}
    </div>
  );
}

export default Input;
