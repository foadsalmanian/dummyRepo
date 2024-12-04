import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { EditTwoTone } from '@ant-design/icons';
import { TInputBaseProps } from 'components/Inputs/types/inputs';
import ErrShow from 'components/ErrShow/ErrShow';
import { useLocalizer } from 'localizer';

interface IEditableLabelProps extends TInputBaseProps {
  label: string;
  onClick: () => void;
  readonly disabled?: boolean;
  className?: string;
  validationMessage?: string;
  helperText?: string;
}
const EditableLabel = (props: IEditableLabelProps): JSX.Element => {
  const {
    value,
    error,
    onClick,
    options = [],
    className,
    placeholder,
    validationMessage,
    helperText,
    disabled,
  } = props;

  const [val, setVal] = useState(value);
  const { t } = useLocalizer();
  const valueHandler = (value: string) =>
    options?.find(item => item.value === value)?.text ?? '';

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  useEffect(() => {
    if (options.length > 0) {
      setVal(valueHandler(value));
    } else {
      if (value === true) {
        setVal('Yes');
      } else if (value === false) {
        setVal('No');
      } else if (!value) {
        setVal(t('phrase.notSet'));
      } else {
        setVal(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <TextField
        variant='outlined'
        error={error?.message ? !!error : null}
        value={val}
        placeholder={placeholder}
        disabled={true}
        className={className}
        inputProps={{
          className: '!text-black',
          style: { WebkitTextFillColor: 'black' },
        }}
        aria-readonly
        InputProps={{
          endAdornment: !disabled && (
            <EditTwoTone
              className='text-lg'
              disabled={false}
              onClick={onClick}
            />
          ),
        }}
      />
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </>
  );
};
export default EditableLabel;
