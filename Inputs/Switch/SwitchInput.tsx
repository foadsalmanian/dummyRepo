import React, { useEffect } from 'react';
import { Switch } from '@mui/material';
import { TInputBaseProps } from '../types/inputs';
import { isBoolean } from 'lodash';

interface ISwitchInputProps extends TInputBaseProps {
  size?: 'small' | 'medium' | 'large';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  className?: string;
}
const SwitchInput = (props: ISwitchInputProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    color,
    size = 'medium',
    disabled,
    name,
    inputRef,
    defaultValue,
    className,
  } = props;

  useEffect(() => {
    if (typeof value === 'boolean') return;
    if (typeof defaultValue === 'boolean') return onChangeValue(defaultValue);
    return onChangeValue(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onClick = () => {
    onChangeValue && onChangeValue(!value);
  };
  return (
    <Switch
      className={`justify-center ${className}`}
      {...props}
      checked={isBoolean(value) ? value : defaultValue}
      onClick={onClick}
      value={isBoolean(value) ? value : defaultValue}
      color={color}
      size={size}
      disabled={disabled}
      name={name}
      inputRef={inputRef}
    />
  );
};

export default SwitchInput;
