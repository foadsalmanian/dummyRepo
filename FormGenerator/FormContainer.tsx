import SectionSeparator from 'components/SectionSeparator/SectionSeparator';
import { useLocalizer } from 'localizer';
import { ReactNode } from 'react';
import { TContainerProps } from 'types/TFormGen';

interface IFormContainerProps extends TContainerProps {
  children: ReactNode;
  secondary?: ReactNode;
}

const FormContainer = (props: IFormContainerProps) => {
  const { children, title, secondary = null } = props;
  const { t } = useLocalizer();

  return (
    <SectionSeparator title={t(title)} secondary={secondary}>
      {children}
    </SectionSeparator>
  );
};

export default FormContainer;
