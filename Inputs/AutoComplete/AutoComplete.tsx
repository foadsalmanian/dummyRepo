import {
  KeyboardEventHandler,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteChangeReason,
  TextField,
  AutocompleteRenderGetTagProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { uniqBy } from 'lodash';
import { TInputBaseProps } from '../types/inputs';
import useCountryMeta from 'hooks/useCountryMeta';
import useWindowSize from 'hooks/useWindowSize';
import { useLocalizer } from 'localizer';
import { cn } from 'utils/common';
import { Box } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Chip } from '@mui/material';
import HelperShow, { THelperShowType } from 'components/ErrShow/HelperShow';

export interface IAutoCompleteProps
  extends TInputBaseProps<
    string | IOption[],
    IOption[],
    IOption | IOption[],
    IOption
  > {
  disableClearable?: boolean;
  limitTags?: boolean;
  limitTagNum?: number;
  isMultiple?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  helperText?: string;
  onError?: (error) => void;
  hasEmptyOption?: boolean;
  hasAllOption?: boolean;
  isCountry?: boolean;
  className?: string;
  hasIsActive?: boolean;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
  renderOption?: (option: IOption) => ReactNode;
  renderTags?: (
    option: IOption,
    getTagProps: AutocompleteRenderGetTagProps,
    index: number,
  ) => ReactNode;
  showTags?: boolean;
  startIcon?: (option: IOption) => ReactNode;
  translatePlaceHolder?: boolean;
  allowMultiSelect?: boolean;
}

export interface IOption {
  text: string;
  value: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
}

const AutoComplete = (props: IAutoCompleteProps): JSX.Element => {
  const theme = useTheme();
  const {
    options,
    defaultValue,
    value = [],
    placeholder,
    limitTags,
    limitTagNum,
    disabled,
    isMultiple = true,
    size = 'medium',
    onChangeValue,
    disableClearable = true,
    onError = () => null,
    error,
    validationMessage,
    helperText,
    hasEmptyOption = false,
    hasAllOption = false,
    isCountry = false,
    className,
    onBlur,
    onFocus,
    inputRef,
    name,
    onKeyUp,
    renderOption = null,
    renderTags = null,
    showTags = true,
    startIcon = null,
    translatePlaceHolder,
    allowMultiSelect = false,
  } = props;

  const [firstValueClone, setFirstValueClone] = useState<any>();

  useEffect(() => {
    setFirstValueClone(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useLocalizer();
  const { getCountry } = useCountryMeta();
  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'removeOption' && isMultiple) {
      return onChangeValue(value);
    }

    if (disabled && isMultiple) return null;

    if (!isMultiple) return onChangeValue(value);

    if (onChangeValue) {
      const testVal = uniqBy(value as any, (e: any) => {
        return e?.text;
      });
      onChangeValue(testVal);
    }
  };

  const { width } = useWindowSize();
  const emptyOption = { text: t('phrase.notSet'), value: '' };
  const allOption = { text: t('phrase.general.all'), value: '' };

  const getLimitTag = (): number => {
    if (limitTagNum) return limitTagNum;
    if (width < 1301) return 1;
    if (1300 < width && width < 2100) return 2;
    return 3;
  };
  const getHelperProps = (): {
    type: THelperShowType;
    content: string | Array<any>;
  } => {
    if ((!error || !error?.message) && !validationMessage)
      return {
        type: !helperText ? 'none' : 'helper',
        content: helperText ?? null,
      };
    return {
      type: 'error',
      content: !error ? validationMessage : error.message,
    };
  };

  const getFinalValue = (): IOption | IOption[] => {
    let finalVal: any = value;
    if (!isMultiple) {
      if (Array.isArray(value)) finalVal = value[0];
    }

    if (!finalVal && hasEmptyOption) finalVal = emptyOption;
    if (!finalVal && hasAllOption) finalVal = allOption;
    if (isMultiple && !Object.keys(finalVal ?? {}).length && hasEmptyOption)
      finalVal = emptyOption;
    if (isMultiple && !Object.keys(finalVal ?? {}).length && hasAllOption)
      finalVal = allOption;

    if (isMultiple && !Array.isArray(finalVal)) finalVal = [value];

    if (
      typeof finalVal !== 'string' &&
      typeof finalVal !== 'number' &&
      !isMultiple
    )
      return finalVal;
    if (!isCountry) {
      const option = getFinalOptions().find(
        opt => String(opt.value) === String(finalVal),
      );
      if (option) return option;
      return finalVal as any;
    }
    if (!isMultiple)
      return typeof finalVal !== 'string'
        ? finalVal
        : (getCountry(finalVal as string, 'obj') as IOption);
    return (finalVal as IOption[]).map(val => {
      if (typeof val !== 'string') return val;
      return getCountry(val, 'obj') as IOption;
    });
  };

  const getFinalOptions = () => {
    const finalOptions = [];
    options?.forEach((opt: any) => {
      if (
        opt.isActive === undefined ||
        opt.isActive ||
        opt?.title === firstValueClone ||
        opt?.text === firstValueClone ||
        opt?.text === firstValueClone?.text ||
        opt?.key === firstValueClone ||
        opt?.value === firstValueClone
      ) {
        finalOptions.push({
          text: opt.title ?? opt.text,
          value: opt.key ?? opt.value ?? opt.id,
          isDisabled: opt.isDisabled ?? false,
        });
      }
    });
    if (!isMultiple && hasEmptyOption) return [emptyOption, ...finalOptions];
    if (!isMultiple && hasAllOption) return [allOption, ...finalOptions];
    return finalOptions;
  };

  return (
    <MuiAutocomplete
      onKeyUp={onKeyUp}
      className={cn(
        '!w-full',
        className,
        disabled && isMultiple && 'opacity-75',
        disabled && 'cursor-default',
      )}
      multiple={isMultiple}
      limitTags={limitTags ? getLimitTag() : -1}
      id='size-small-outlined-multi-autocomplete'
      options={getFinalOptions()}
      getOptionLabel={(option: IOption) => option?.text ?? ''}
      getOptionDisabled={opt => {
        return opt?.isDisabled;
      }}
      defaultValue={defaultValue}
      size={size}
      value={getFinalValue()}
      noOptionsText={t('components.autocomplete.noOptions')}
      disabled={disabled && !isMultiple}
      onChange={handleChange}
      disableCloseOnSelect={allowMultiSelect}
      disableClearable={disableClearable}
      onError={onError}
      // Render tags for multiple selection
      renderTags={(value, getTagProps) => {
        if (!showTags) return null;
        return value.map((option, index) => {
          if (renderTags) {
            return renderTags(option, getTagProps, index);
          }

          return (
            <Chip
              key={index}
              variant='outlined'
              label={option?.text}
              {...getTagProps({ index })}
            />
          );
        });
      }}
      renderOption={(params, option) => {
        const isEmptyOption = option.value === emptyOption.value;

        return (
          <Box
            component={'li'}
            {...params}
            sx={{
              color: isEmptyOption ? theme.palette.grey[400] : 'inherit',
            }}
          >
            {renderOption ? renderOption(option) : option.text}
          </Box>
        );
      }}
      renderInput={params => {
        const option = getFinalOptions().find(
          item => item.text === params.inputProps.value,
        );
        const isEmptyOptionSelected = option?.value === emptyOption.value;

        return (
          <>
            <TextField
              {...params}
              error={error?.message ? !!error : null}
              placeholder={
                placeholder
                  ? translatePlaceHolder
                    ? t(placeholder)
                    : placeholder
                  : undefined
              }
              inputRef={inputRef}
              name={name}
              disabled={disabled}
              InputProps={{
                ...params.InputProps,
                readOnly: true,
                startAdornment:
                  startIcon && option ? (
                    <InputAdornment position='start'>
                      <Box className={'ml-3 -mr-2'}>{startIcon(option)}</Box>
                    </InputAdornment>
                  ) : (
                    params.InputProps.startAdornment
                  ),
                style: {
                  color: isEmptyOptionSelected
                    ? theme.palette.grey[400]
                    : 'inherit',
                },
              }}
            />
            <HelperShow {...getHelperProps()} />
          </>
        );
      }}
      sx={style(isMultiple, disabled)}
      classes={{ popper: disabled && isMultiple ? 'hidden' : '' }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

const style = (isMultiple: boolean, disabled: boolean) => {
  return {
    '& .MuiOutlinedInput-root': {
      p: isMultiple ? 0.24 : 0.42,
      ...(disabled && { pointerEvents: 'none' }),
    },
    '& .MuiAutocomplete-tag': {
      bgcolor: 'primary.lighter',
      fontSize: '12px',
      border: '1px solid',
      borderRadius: 1,
      pl: 1.5,
      pr: 1.5,
      py: 0,
      lineHeight: '30px',
      borderColor: 'primary.light',
      '& .MuiChip-label': {
        lineHeight: '25px',
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '0px',
        fontSize: '12px',
      },
      '& .MuiSvgIcon-root': {
        marginTop: '0px',
        color: 'primary.main',
        fontSize: '17px',
        ml: 1,
        mr: -0.75,
        '&:hover': {
          color: 'primary.dark',
        },
      },
    },
  };
};

export default AutoComplete;
