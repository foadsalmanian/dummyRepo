import { useEffect } from 'react';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TInputBaseProps } from '../types/inputs';
import {
  ITranslationsObj,
  getCurrentCode,
} from 'components/Inputs/MultiLingInput/translations';
import { FieldError } from 'react-hook-form';
import ErrShow from 'components/ErrShow/ErrShow';

interface IMultiLingInputProps
  extends TInputBaseProps<ITranslationsObj, Array<string>> {
  requiredLanguages: string[];
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
  clearErrors: (name?: string | string[] | readonly string[]) => void;
}

const MultiLingInput = (props: IMultiLingInputProps): JSX.Element => {
  const {
    options,
    requiredLanguages,
    value,
    onChangeValue,
    error,
    validationMessage,
    helperText,
    clearErrors,
  } = props;
  const theme = useTheme();

  const isFull = (mainCode: string) => {
    if (!value) return 0;
    if (
      value[mainCode]?.subject?.trim() &&
      (typeof value[mainCode]?.message !== 'string'
        ? value[mainCode]?.message?.getCurrentContent().getPlainText().trim()
        : value[mainCode]?.message.trim())
    ) {
      return 2;
    } else if (
      value[mainCode]?.subject?.trim() ||
      (typeof value[mainCode]?.message !== 'string'
        ? value[mainCode]?.message?.getCurrentContent().getPlainText().trim()
        : value[mainCode]?.message.trim()) ||
      value[mainCode]?.value
    ) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    onChangeValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  // const CustomButton = styled((props: ButtonProps) => (
  //   <Button disableRipple {...props} />
  // ))(({ theme }) => ({
  //   '&:active': {
  //     boxShadow: 'none !important',
  //   },
  //   '.css-pfg5cc-MuiButtonBase-root-MuiButton-root::after': {
  //     boxShadow: 'none',
  //   },
  // }));

  return (
    <>
      <ButtonGroup
        size='small'
        variant='contained'
        className='border shadow !border-slate-300 w-fit'
      >
        {options
          ?.sort((a, b) =>
            requiredLanguages?.includes(a) && requiredLanguages?.includes(b)
              ? 0
              : requiredLanguages?.includes(a)
              ? -1
              : 1,
          )
          .map(mainCode => (
            <Button
              key={mainCode}
              disableRipple
              disableFocusRipple
              onClick={() => {
                clearErrors('value');
                clearErrors('subject');
                clearErrors('message');
                const vals = {};
                Object.keys(value)?.forEach(tempCode => {
                  vals[tempCode] = {
                    ...value[tempCode],
                    isActive: mainCode === tempCode,
                  };
                });
                onChangeValue(vals);
              }}
              className='bg-opacity-25 border !border-slate-200 after:shadow-none active:shadow-none focus:outline-none'
              size='small'
              style={{
                background:
                  getCurrentCode(value) === mainCode
                    ? theme.palette.primary.main
                    : theme.palette.common.white,
                color:
                  getCurrentCode(value) !== mainCode
                    ? isFull(mainCode) !== 0
                      ? isFull(mainCode) ===
                        Object.keys(value[getCurrentCode(value)]).length - 2
                        ? theme.palette.success.light
                        : theme.palette.warning.light
                      : theme.palette.primary.main
                    : theme.palette.common.white,
              }}
            >
              {mainCode.toUpperCase()}
              {requiredLanguages?.includes(mainCode) && (
                <Typography className='inline ml-1'>*</Typography>
              )}
            </Button>
          ))}
      </ButtonGroup>
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </>
  );
};

export default MultiLingInput;
