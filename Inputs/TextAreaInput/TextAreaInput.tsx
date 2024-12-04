import { ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { FieldError } from 'react-hook-form';
import { TInputBaseProps } from '../types/inputs';
import ErrShow from 'components/ErrShow/ErrShow';
import { useLocalizer } from 'localizer';

interface ITextAreaInputProps extends TInputBaseProps {
  disabled?: boolean;
  className?: string;
  rows?: number;
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
}

const TextAreaInput = (props: ITextAreaInputProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    onMouseDown,
    onMouseUp,
    onFocus,
    placeholder,
    className = '',
    disabled = false,
    rows = 4,
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
  const { t } = useLocalizer();
  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  return (
    <>
      <TextField
        value={value ?? ''}
        onChange={handleChange}
        placeholder={t(placeholder)}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onFocus={onFocus}
        disabled={disabled}
        className={className}
        multiline
        rows={rows}
        error={error?.message ? !!error : null}
        onBlur={onBlur}
        inputRef={inputRef}
        name={name}
      />
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </>
  );
};

export default TextAreaInput;
