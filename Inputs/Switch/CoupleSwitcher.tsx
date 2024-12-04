import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { TInputBaseProps } from '../types/inputs';
import { useTheme } from '@mui/material/styles';
import { useLocalizer } from 'localizer';

interface ICoupleSwitcherProps extends TInputBaseProps {
  leftValue: string;
  rightValue: string;
}
const CoupleSwitcher = (props: ICoupleSwitcherProps): JSX.Element => {
  const {
    defaultValue,
    leftValue,
    rightValue,
    value,
    disabled,
    onChangeValue,
    inputRef,
  } = props;

  const theme = useTheme();
  const { t } = useLocalizer();

  useEffect(() => {
    if (typeof value === 'boolean') return;
    if (typeof defaultValue === 'boolean') return onChangeValue(defaultValue);
    return onChangeValue(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Box
      className={`py-1 px-1 w-fit justify-between rounded gap-2 flex items-center min-w-[100px] ${
        disabled && 'cursor-not-allowed'
      }`}
      sx={{
        backgroundColor: disabled
          ? theme.palette.grey[300]
          : theme.palette.primary[200],
        border: `0.5px solid`,
        borderColor: disabled
          ? theme.palette.grey[400]
          : theme.palette.primary.light,
      }}
    >
      <label
        htmlFor='switch-input-left'
        className={`w-fit py-1 px-3 rounded transition-all duration-300 font-semibold capitalize text-base cursor-pointer ${
          !value && 'text-white'
        } ${disabled && 'cursor-not-allowed'}`}
        style={{
          backgroundColor:
            !value &&
            theme.palette[disabled ? 'grey' : 'primary'][
              disabled ? 500 : 'main'
            ],
        }}
      >
        {t(leftValue)}
      </label>

      <input
        {...props}
        type='radio'
        id='switch-input-left'
        name='switch-input-left'
        onChange={() => onChangeValue(false)}
        checked={!value}
        disabled={disabled}
        style={{ display: 'none' }}
        ref={inputRef}
      />

      <input
        {...props}
        type='radio'
        id='switch-input-right'
        name='switch-input-right'
        onChange={() => onChangeValue(true)}
        checked={value}
        disabled={disabled}
        style={{ display: 'none' }}
        ref={inputRef}
      />

      <label
        htmlFor='switch-input-right'
        className={`w-fit py-1 px-3 rounded transition-all duration-300 font-semibold capitalize text-base cursor-pointer ${
          value && ' text-white'
        } ${disabled && 'cursor-not-allowed'}`}
        style={{
          backgroundColor:
            value &&
            theme.palette[disabled ? 'grey' : 'primary'][
              disabled ? 500 : 'main'
            ],
        }}
      >
        {t(rightValue)}
      </label>
    </Box>
  );
};

export default CoupleSwitcher;
