import { useState, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { FieldError } from 'react-hook-form';
import ErrShow from 'components/ErrShow/ErrShow';
import { TInputBaseProps } from '../types/inputs';
import HelperTextShow from 'components/HelperTextShow/HelperTextShow';
import { useLocalizer } from 'localizer';
import { InputAdornment } from '@mui/material';
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

interface ITextInputProps extends TInputBaseProps {
  disabled?: boolean;
  className?: string;
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
  hasClearIcon?: boolean;
  min?: number;
}

const TextInput = (props: ITextInputProps): JSX.Element => {
  const {
    value,
    onChangeValue,
    onMouseDown,
    onMouseUp,
    onFocus,
    onKeyDown,
    placeholder,
    className = '',
    disabled = false,
    error,
    helperText,
    onBlur,
    validationMessage,
    inputRef,
    name,
    defaultValue,
    hasClearIcon,
    type,
    min,
  } = props;

  const { t } = useLocalizer();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const localMin = min ?? 0;
    if (
      type === 'number' &&
      Number(e.target.value) < localMin &&
      e.target.value !== ''
    ) {
      onChangeValue('');
      return;
    }
    onChangeValue(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  const inputProps =
    type === 'password' || hasClearIcon
      ? {
          endAdornment: (
            <InputAdornment position='end'>
              {type === 'password' &&
                (showPassword ? (
                  <EyeInvisibleOutlined onClick={toggleShowPassword} />
                ) : (
                  <EyeOutlined onClick={toggleShowPassword} />
                ))}
              {hasClearIcon && (
                <CloseOutlined
                  className='cursor-pointer'
                  onClick={() => onChangeValue('')}
                />
              )}
            </InputAdornment>
          ),
        }
      : type === 'number'
      ? {
          inputProps: { min },
        }
      : {};

  const handleKeyDown = event => {
    if (type === 'number' && ['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <>
      <TextField
        inputRef={inputRef}
        name={name}
        variant='outlined'
        error={error?.message ? !!error : null}
        value={value ?? ''}
        onChange={handleChange}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onFocus={onFocus}
        onKeyDown={e => {
          handleKeyDown(e);
          onKeyDown(e);
        }}
        placeholder={t(placeholder)}
        disabled={disabled}
        className={className}
        onBlur={onBlur}
        defaultValue={defaultValue}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        InputProps={inputProps}
      />
      {!!error?.message && !!error && <ErrShow err={getHelperText()} />}
      {!!helperText && (!error || !error.message) && (
        <HelperTextShow err={helperText} />
      )}
    </>
  );
};

export default TextInput;
