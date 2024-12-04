import { CheckCircleTwoTone } from '@ant-design/icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import SectionSeparator from 'components/SectionSeparator/SectionSeparator';
import { useLocalizer } from 'localizer';
import { ReactNode } from 'react';
import { TContainerProps } from 'types/TFormGen';

interface IAccordionContainerProps extends TContainerProps {
  children: ReactNode;
  isContainerFilled?: boolean;
}

const AccordionContainer = (props: IAccordionContainerProps) => {
  const { children, title, isContainerFilled = false } = props;
  const { t } = useLocalizer();
  const theme = useTheme();

  return (
    <Box
      className='my-4'
      sx={{
        '& .MuiAccordion-root': {
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            flexDirection: 'row',
          },
          '& .MuiAccordionDetails-root': {
            borderColor: theme.palette.divider,
          },
          '& .Mui-expanded': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Accordion>
        <AccordionSummary>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Typography variant='h6' className='font-bold'>
              {t(title)}
            </Typography>
            {isContainerFilled && <CheckCircleTwoTone className='text-lg' />}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccordionContainer;
