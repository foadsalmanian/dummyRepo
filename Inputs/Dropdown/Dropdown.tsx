import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Typography, colors, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FieldError } from 'react-hook-form';
import {
  TAutoComplete,
  TDropdownOptions,
  TInputBaseProps,
} from '../types/inputs';
import ErrShow from 'components/ErrShow/ErrShow';
import { useLocalizer } from 'localizer';
import { cn } from 'utils/common';

interface IDropdownProps
  extends TInputBaseProps<string, TDropdownOptions, string, string | null> {
  label?: string;
  size?: 'small' | 'medium';
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
  autocomplete?: TAutoComplete;
  className?: string;
  hasEmptyOption?: boolean;
  hasAnyOption?: boolean;
  hasAllOption?: boolean;
}

const Dropdown = (props: IDropdownProps): JSX.Element => {
  const {
    onChangeValue,
    options,
    value,
    placeholder,
    label,
    size,
    error,
    helperText,
    validationMessage,
    onBlur,
    defaultValue = null,
    autocomplete = 'off',
    disabled,
    hasEmptyOption = false,
    hasAnyOption = false,
    hasAllOption = false,
    inputRef,
    name,
    className,
  } = props;

  const [firstValueClone, setFirstValueClone] = useState<string | any[]>();

  useEffect(() => {
    setFirstValueClone(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useLocalizer();
  const theme = useTheme();
  const [defaultColor, setDefaultColor] = useState<{
    name: string;
    shade: number;
  }>();

  useEffect(() => {
    setDefaultColor(
      options?.find(item => item?.value?.toString() === defaultValue)?.color,
    );
  }, [defaultValue, options]);

  //-----------------------------------------------------------------------------------

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  const getFinalOptions = () => {
    const finalOptions: TDropdownOptions = options ?? [];

    const hasAny = finalOptions.some(item => item.text === t('phrase.anySet'));
    const hasEmpty = finalOptions.some(
      item => item.text === t('phrase.notSet'),
    );
    const hasAll = finalOptions.some(
      item => item.text === t('phrase.general.all'),
    );

    if (hasEmptyOption && !hasEmpty) {
      finalOptions.unshift({ text: t('phrase.notSet'), value: ' ' });
    }
    if (hasAnyOption && !hasAny) {
      finalOptions.unshift({ text: t('phrase.anySet'), value: ' ' });
    }
    if (hasAllOption && !hasAll) {
      finalOptions.unshift({ text: t('phrase.general.all'), value: ' ' });
    }

    return finalOptions.filter(
      item =>
        item.isActive === undefined ||
        item.isActive ||
        item.key === firstValueClone ||
        item.value === firstValueClone,
    );
  };

  const finalValues = (): string => {
    if (hasEmptyOption) {
      if (!Object.keys(value ?? {})?.length) return ' ';
      if (!value) return ' ';
    }
    if (hasAnyOption) {
      if (!Object.keys(value ?? {})?.length) return ' ';
      if (!value) return ' ';
    }
    if (hasAllOption) {
      if (!Object.keys(value ?? {})?.length) return ' ';
      if (!value) return ' ';
    }
    return value;
  };

  const renderValue = (value: string) => {
    if (value === ' ') {
      if (hasEmptyOption) return <Typography>{t('phrase.notSet')}</Typography>;
      if (hasAnyOption) return <Typography>{t('phrase.anySet')}</Typography>;
      if (hasAllOption)
        return <Typography>{t('phrase.general.all')}</Typography>;
    }

    const color = options?.find(
      item => (item?.value?.toString() || item?.key?.toString()) === value,
    )?.color;
    return (
      <Typography
        sx={{
          color: color
            ? colors[color.name][color.shade]
            : theme.palette.grey[900],
        }}
      >
        {color && (
          <Chip
            className='w-[5px] h-[5px] rounded-full mr-2'
            sx={{ backgroundColor: colors[color.name][color.shade] }}
          />
        )}
        {options?.find(
          item =>
            item?.value?.toString() === value ||
            item?.text?.toString() === value ||
            item?.key?.toString() === value,
        )?.text ||
          options?.find(
            item =>
              item?.value?.toString() === value ||
              item?.text?.toString() === value ||
              item?.key?.toString() === value,
          )?.title}
      </Typography>
    );
  };

  return (
    <>
      {label && (
        <InputLabel className='mb-2' id={`dropdown-label-${label}`}>
          {label}
        </InputLabel>
      )}

      <Select
        disabled={disabled}
        size={size}
        labelId={`dropdown-label-${label ?? ''}`}
        id={`dropdown-${label ?? ''}`}
        className={cn('!w-full', className)}
        onChange={onChangeValue as any}
        placeholder={placeholder}
        onBlur={onBlur}
        error={error?.message ? !!error : null}
        defaultValue={defaultValue}
        value={finalValues() !== null ? finalValues()?.toString() : ''}
        autoComplete={autocomplete}
        renderValue={renderValue}
        name={name}
        inputRef={inputRef}
      >
        {defaultValue && (
          <MenuItem
            className='w-full'
            value={''}
            sx={{
              color: defaultColor
                ? colors[defaultColor.name][defaultColor.shade]
                : theme.palette.grey[900],
            }}
          >
            {defaultColor && (
              <Chip
                className='w-[5px] h-[5px] rounded-full mr-2'
                sx={{
                  backgroundColor:
                    colors[defaultColor.name][defaultColor.shade],
                }}
              />
            )}
            {t(defaultValue)}
          </MenuItem>
        )}

        {getFinalOptions()?.map(
          ({ title, key, text, value: optValue, color }, i) => {
            return (
              <MenuItem
                className='w-full'
                key={i}
                value={optValue || key}
                sx={{
                  color: color
                    ? colors[color.name][color.shade]
                    : theme.palette.grey[900],
                }}
              >
                {color && (
                  <Chip
                    className='w-[5px] h-[5px] rounded-full mr-2'
                    sx={{ backgroundColor: colors[color.name][color.shade] }}
                  />
                )}
                {text || title}
              </MenuItem>
            );
          },
        )}
      </Select>
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </>
  );
};

export default Dropdown;
