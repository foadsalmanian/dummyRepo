import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { FieldError } from 'react-hook-form';
import ErrShow from 'components/ErrShow/ErrShow';
import { Box } from '@mui/material';
import { TInputBaseProps } from '../types/inputs';

interface INumberInputProps extends TInputBaseProps {
  disabled?: boolean;
  className?: string;
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
}
const NumberInput = (props: INumberInputProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    placeholder,
    className = '',
    disabled = false,
    error,
    helperText,
    onBlur,
    validationMessage,
    inputRef,
    name,
  } = props;

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => onChangeValue(e.target.value);

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  return (
    <Box className='flex flex-col w-full'>
      <TextField
        inputRef={inputRef}
        name={name}
        variant='outlined'
        error={error?.message ? !!error : null}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        onBlur={onBlur}
        type='number'
      />
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </Box>
  );
};

export default NumberInput;
