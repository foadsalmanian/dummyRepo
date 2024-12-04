import { Box } from '@mui/material';
import SectionSeparator from 'components/SectionSeparator/SectionSeparator';
import { useLocalizer } from 'localizer';
import { ReactNode } from 'react';
import { TContainerProps } from 'types/TFormGen';

interface IConditionalContainerProps extends TContainerProps {
  children: ReactNode;
  hideChildren?: boolean;
  options: JSX.Element;
  secondary?: ReactNode;
}
const ConditionalContainer = (props: IConditionalContainerProps) => {
  const {
    children,
    title,
    hideChildren = false,
    options,
    secondary = null,
  } = props;
  const { t } = useLocalizer();

  return (
    <SectionSeparator
      title={t(title)}
      subheader={options}
      classes={{
        content: 'px-4 bg-gray-200 flex justify-between items-center',
        root: 'p-0',
      }}
      content={false}
      divider={false}
      className='mb-4'
      secondary={secondary}
    >
      <Box className='border-gray-200 border-2 !m-0 px-4'>
        {!hideChildren ? children : null}
      </Box>
    </SectionSeparator>
  );
};

export default ConditionalContainer;
