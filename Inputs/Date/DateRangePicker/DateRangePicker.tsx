import React from 'react';
import DatePicker from '../DatePicker/DatePicker';
import { Box, FormControl, Tooltip } from '@mui/material';
import { formattedDayjs } from 'utils/common';
import { useLocalizer } from 'localizer';

interface IDateRangePickerProps {
  value: string[] | string;
  fromOnKeyUp?: (e: any) => void;
  fromOnChange: (e: any) => void;
  toOnKeyUp?: (e: any) => void;
  toOnChange: (e: any) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  disableTooltip?: boolean;
}
const DateRangePicker = (props: IDateRangePickerProps): JSX.Element => {
  const {
    value,
    fromOnKeyUp,
    fromOnChange,
    toOnKeyUp,
    toOnChange,
    fromPlaceholder = 'phrase.general.from',
    toPlaceholder = 'phrase.general.to',
    disableTooltip = false,
  } = props;
  const { t } = useLocalizer();

  const tooltip = () => {
    if (value.length > 0 && (value[0] || value[1])) {
      return `
      ${
        value[0]
          ? `${t('phrase.general.from')} ${formattedDayjs(value[0]).format(
              t('format.dateFormat'),
            )}`
          : ''
      }
      ${
        value[1]
          ? `${t('phrase.general.until')} ${formattedDayjs(value[1]).format(
              t('format.dateFormat'),
            )}`
          : ''
      }
      `;
    }
    return '';
  };

  const formattedFilterValue = Array.isArray(value) ? value : value.split(',');

  return (
    <FormControl fullWidth>
      <Tooltip arrow placement='top' title={disableTooltip ? '' : tooltip()}>
        <Box className='flex flex-1 w-full gap-2'>
          <DatePicker
            placeholder={t(fromPlaceholder)}
            onKeyUp={fromOnKeyUp}
            value={(value[0] || formattedFilterValue[0]) ?? undefined}
            maxDate={value[1] ? formattedDayjs(value[1]) : undefined}
            onChangeValue={fromOnChange}
            size='small'
          />

          <DatePicker
            onKeyUp={toOnKeyUp}
            placeholder={t(toPlaceholder)}
            minDate={value[0] ? formattedDayjs(value[0]) : undefined}
            value={
              formattedDayjs(formattedFilterValue[1]).isAfter(
                formattedFilterValue[0],
              ) ||
              formattedDayjs(value[1]).isAfter(value[0]) ||
              value[0] === value[1] ||
              !value[0]
                ? value[1] || formattedFilterValue[1]
                : undefined
            }
            onChangeValue={toOnChange}
            size='small'
          />
        </Box>
      </Tooltip>
    </FormControl>
  );
};

export default DateRangePicker;
