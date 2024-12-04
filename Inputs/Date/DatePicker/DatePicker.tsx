import { FocusEvent, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateValidationError } from '@mui/x-date-pickers';
import { deDE, enUS } from '@mui/x-date-pickers/locales';
import dayjs, { Dayjs } from 'dayjs';
import de from 'dayjs/locale/de';
import en from 'dayjs/locale/en-gb';
import ErrShow from 'components/ErrShow/ErrShow';
import { TInputBaseProps } from 'components/Inputs/types/inputs';
import { useLocalizer } from 'localizer';
import isBetween from 'dayjs/plugin/isBetween';
import { TFnInput } from 'localizer/useLocalizer';
import { cn, formattedDayjs } from 'utils/common';
import { styled, Theme } from '@mui/material';
dayjs.extend(isBetween);
//---------------------------------------------------------------------------------

interface IDatePickerProps extends TInputBaseProps<any | undefined, undefined> {
  isMobile?: boolean | null;
  helperText?: string;
  label?: string;
  disabled?: boolean;
  isReadOnly?: boolean;
  defaultValue?: Dayjs;
  minDate?: Dayjs;
  disablePast?: boolean;
  onError?: (error: DateValidationError) => void;
  dateFormat?: string;
  disableFuture?: boolean;
  maxDate?: Dayjs;
  id?: string;
  onKeyUp?: (e) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function DatePicker(props: IDatePickerProps) {
  const {
    helperText,
    placeholder,
    label,
    isReadOnly = false,
    disabled = false,
    onChangeValue,
    value,
    defaultValue,
    minDate,
    disablePast,
    onError = () => null,
    error,
    validationMessage,
    disableFuture,
    onBlur,
    maxDate,
    id,
    inputRef,
    name,
    className,
    size,
  } = props;
  // eslint-disable-next-line no-useless-escape

  type TStyledProps = {
    theme: Theme;
  };

  const MuiDatePickerStyle = styled(MuiDatePicker, {
    shouldForwardProp: prop => prop !== 'shape' && prop !== 'variant',
  })(({ theme }: TStyledProps) => ({
    ...(value && {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
    }),
  }));

  const { locale } = useLocalizer();
  const { t } = useLocalizer();

  const hideTodayButton = dayjs().isBefore(minDate);

  const adapterLocale: any = locale === 'de' ? de : en;
  const localeText =
    locale === 'de'
      ? deDE.components.MuiLocalizationProvider.defaultProps.localeText
      : enUS.components.MuiLocalizationProvider.defaultProps.localeText;

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    if (value === '') onChangeValue(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceUpdate]);

  const invokeForceUpdate = () => setForceUpdate(prev => prev + 1);

  useEffect(() => {
    if (value && typeof value !== 'string')
      onChangeValue(value.format(t('format.apiDateFormat')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
      localeText={localeText}
    >
      <MuiDatePickerStyle
        {...props}
        maxDate={maxDate}
        disabled={disabled}
        label={label}
        readOnly={isReadOnly}
        format={t('format.dateFormat')}
        defaultValue={defaultValue}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        onError={onError}
        className={cn('!w-full py-0', className)}
        value={typeof value === 'string' ? formattedDayjs(value) : value}
        onChange={newValue => {
          onChangeValue(
            (newValue as any)?.isValid()
              ? (newValue as any).format(t('format.apiDateFormat'))
              : null,
          );
        }}
        slotProps={{
          actionBar: {
            actions: hideTodayButton
              ? ['clear', 'cancel']
              : ['clear', 'today', 'cancel'],
          },
          textField: {
            id,
            onBlur,
            inputRef,
            name,
            error: !!error,
            value: typeof value === 'string' ? formattedDayjs(value) : value,
            placeholder:
              placeholder !== '' ? t(placeholder) : t('format.dateFormat'),
            onBlurCapture: (newDate: FocusEvent<HTMLDivElement, Element>) =>
              handleOnBlur(
                newDate,
                onChangeValue,
                value,
                invokeForceUpdate,
                t,
                minDate,
                maxDate,
                disableFuture,
              ),
            size: size as any,
            onChange: () => {},
          },
        }}
      />
      {!!error?.message && <ErrShow err={getHelperText()} />}
    </LocalizationProvider>
  );
}

export const handleOnBlur = (
  newDate: FocusEvent<HTMLDivElement, Element>,
  onChangeValue: (newVal: any) => void,
  value: any,
  invokeForceUpdate: () => void,
  t: (input: TFnInput, defaultValue?: string) => string,
  minDate: dayjs.Dayjs,
  maxDate: dayjs.Dayjs,
  disableFuture: boolean,
) => {
  if ((newDate.target as HTMLInputElement).value) {
    const inputValue = (newDate.target as HTMLInputElement).value;
    const [day, month, year] = inputValue.split('.').map(Number);

    const currentDate = formattedDayjs(
      dayjs.utc().format(t('format.dateFormat')),
    );
    const currentDay = currentDate.date();
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();

    const isNaNFlag = isNaN(day) || isNaN(month) || isNaN(year);
    const isFutureFlag =
      (day > currentDay || currentMonth > month + 1 || currentYear > year) &&
      disableFuture;
    const isMinFlag =
      minDate &&
      (minDate?.date() > day ||
        minDate?.month() + 1 > month ||
        minDate?.year() > year);
    const isMaxFlag =
      maxDate &&
      (maxDate?.date() < day ||
        maxDate?.month() + 1 < month ||
        maxDate?.year() < year);

    if (isNaNFlag || isFutureFlag || isMinFlag || isMaxFlag) {
      onChangeValue(value === null ? '' : null);
      invokeForceUpdate();
    } else {
      onChangeValue(
        formattedDayjs(inputValue).format(t('format.apiDateFormat')),
      );
    }
  }
};
