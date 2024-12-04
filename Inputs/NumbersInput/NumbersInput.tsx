import React, { ForwardedRef, forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { InputProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocalizer } from 'localizer';
import { formatCurrency } from 'utils/common';

interface INumbersInputProps {
  valType: 'number' | 'float' | 'currency';
}

const NumbersInput = (props: INumbersInputProps): JSX.Element => {
  const { valType } = props;
  return (
    <Box sx={{ display: 'flex', '& > * + *': { ml: 1 } }}>
      <CustomInput id='outlined-start-adornment' valType={valType} />
    </Box>
  );
};

const CustomInput = forwardRef(function CustomInput(
  props: InputProps & { valType: 'number' | 'float' | 'currency' },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { valType } = props;
  const { locale } = useLocalizer();
  const [currValue, setCurrValue] = useState<any>();

  const handleOnChange = e => {
    const num: string = e.target.value.trim();
    if (!num) return setCurrValue(num);
    const formattedNum = formatCurrency(num, locale, valType);
    if (formattedNum) setCurrValue(formattedNum);
  };

  return (
    <>
      <OutlinedInput
        type='text'
        className='rounded'
        onChange={handleOnChange}
        value={currValue}
        startAdornment={
          valType !== 'currency' ? null : (
            <InputAdornment position='start'>
              {locale === 'en' ? '$' : '€'}
            </InputAdornment>
          )
        }
        endAdornment={
          <InputAdornment
            className='cursor-pointer'
            onClick={() => setCurrValue('')}
            position='end'
          >
            <FontAwesomeIcon icon={['fal', 'close']} />
          </InputAdornment>
        }
        ref={ref}
      />
    </>
  );
});

export default NumbersInput;
