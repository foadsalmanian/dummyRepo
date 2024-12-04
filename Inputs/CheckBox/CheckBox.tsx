import React, { ChangeEvent, useEffect } from 'react';
import { Checkbox } from '@mui/material';
import { TInputBaseProps } from '../types/inputs';
import { cn } from 'utils/common';
interface ICheckBoxProps extends TInputBaseProps {
  size?: 'small' | 'medium';
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
const CheckBox = (props: ICheckBoxProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    color,
    size,
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeValue && onChangeValue(e.target.checked);
  };

  return (
    <Checkbox
      className={cn('p-0 w-fit mt-2.5', className)}
      onChange={handleChange}
      checked={value}
      value={value}
      defaultChecked={defaultValue}
      defaultValue={defaultValue}
      color={color}
      size={size}
      disabled={disabled}
      name={name}
      inputRef={inputRef}
    />
  );
};

export default CheckBox;
