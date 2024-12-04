import { ReactNode } from 'react';
import { Box, FormControlLabel, Typography } from '@mui/material';
import { RegisterOptions, ValidationValueMessage } from 'react-hook-form';
import { useLocalizer } from 'localizer';
import { IFormGenCol } from 'types/TFormGen';

interface IInputLabelProps {
  label: string;
  name: string;
  rules: RegisterOptions;
  children: ReactNode;
  className?: string;
  labelPlacement?: 'top' | 'bottom' | 'end' | 'start';
  disable?: boolean;
  labelExtraComponent?: () => JSX.Element;
  col?: IFormGenCol;
  type?: string;
}

const InputLabel = (props: IInputLabelProps): JSX.Element => {
  const {
    label,
    rules,
    children,
    className,
    labelPlacement = 'top',
    disable = false,
    labelExtraComponent,
    col,
    type,
  } = props;
  const { t } = useLocalizer();
  const Element = labelExtraComponent;
  return (
    <FormControlLabel
      className={`m-0 whitespace-nowrap gap-y-3 w-full ${
        labelPlacement === 'top'
          ? 'items-start'
          : 'items-center align-middle justify-end '
      } ${className}`}
      sx={{ pointerEvents: 'none' }}
      label={
        <Typography
          variant='body1'
          className={`flex justify-between font-medium ${
            type !== 'switch' && 'mb-[-10px]'
          }`}
          sx={{ pointerEvents: 'auto' }}
        >
          {`${t(label)} ${
            (rules?.required as ValidationValueMessage)?.value ? '*' : ''
          }`}
          {!!Element && <Element />}
        </Typography>
      }
      labelPlacement={labelPlacement}
      control={
        <Box
          sx={{ pointerEvents: 'auto' }}
          className={`${
            col?.xs && col?.xs !== 12 && type !== 'checkbox' && 'xs:pr-4 '
          }
                  ${
                    col?.sm &&
                    col?.sm !== 12 &&
                    type !== 'checkbox' &&
                    'sm:pr-4 '
                  }
                  ${
                    col?.md &&
                    col?.md !== 12 &&
                    type !== 'checkbox' &&
                    'md:pr-4 '
                  }
                  ${
                    col?.lg &&
                    col?.lg !== 12 &&
                    type !== 'checkbox' &&
                    'lg:pr-4 '
                  }
                  ${labelPlacement === 'top' ? 'w-full flex flex-col' : ''}
                  ${disable && 'w-min'}`}
        >
          {children as any}
        </Box>
      }
    />
  );
};

export default InputLabel;
