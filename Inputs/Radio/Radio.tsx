import {
  Box,
  FormControlLabel,
  Radio as MuiRadio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useEffect } from 'react';
import { TInputBaseProps } from '../types/inputs';
import { useLocalizer } from 'localizer';
import { cn } from 'utils/common';
import ErrShow from 'components/ErrShow/ErrShow';
import HelperTextShow from 'components/HelperTextShow/HelperTextShow';

interface IRadioProps<T = string> extends TInputBaseProps<T, IOptions<T>[]> {
  className?: string;
  helperText?: string;
}

interface IOptions<T = any> {
  size?: 'small' | 'medium';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  value: T;
  text: string | (() => string | JSX.Element);
  disabled?: boolean;
  labelSubTitle?: string;
}
const Radio = (props: IRadioProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    disabled,
    inputRef,
    defaultValue,
    options,
    className,
    name,
    error,
    helperText,
    validationMessage,
  } = props;
  const { t } = useLocalizer();
  useEffect(() => {
    if (!value && defaultValue) onChangeValue(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeValue && onChangeValue(e.target.value);
  };

  const renderOptions = () => {
    return options?.map(
      (
        {
          value: optValue,
          color,
          size,
          disabled: optDisabled,
          text: optLabel,
          labelSubTitle,
        },
        i,
      ) => {
        return (
          <FormControlLabel
            key={i}
            value={optValue}
            control={
              <MuiRadio
                color={color}
                size={size}
                disabled={optDisabled ?? disabled}
              />
            }
            label={
              <Box className='flex flex-col'>
                {typeof optLabel === 'function' ? optLabel() : t(optLabel)}
                <Typography variant='subtitle2' className='text-[10px]'>
                  {t(labelSubTitle)}
                </Typography>
              </Box>
            }
          />
        );
      },
    );
  };

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  return (
    <>
      <RadioGroup
        defaultValue={defaultValue}
        name={name}
        ref={inputRef}
        className={cn(className)}
        onChange={handleChange}
        value={value ?? defaultValue}
      >
        {renderOptions()}
      </RadioGroup>
      {!!error?.message && !!error && <ErrShow err={getHelperText()} />}
      {!!helperText && (!error || !error.message) && (
        <HelperTextShow err={helperText} />
      )}
    </>
  );
};

export default Radio;
