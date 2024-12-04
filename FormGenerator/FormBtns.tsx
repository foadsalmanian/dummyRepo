/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import GenericButton from 'components/GenericButton/GenericButton';

interface IFormBtnsProps {
  onCancel: () => void;
  onSubmit: () => void;
  position?: 'left' | 'right' | 'center';
  submitText?: string;
  submitIcon?: any;
  cancelText?: string;
  cancelIcon?: any;
  hideCancelBtn?: boolean;
  btnSpace?: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  isSubmitting?: boolean;
  isCancelDisabled?: boolean;
  isSubmitDisabled?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
}
const FormBtns = (props: IFormBtnsProps) => {
  const {
    onCancel,
    onSubmit,
    position = 'right',
    submitText = 'phrase.general.save',
    cancelText = 'phrase.discardChanges',
    submitIcon = <CheckOutlined />,
    cancelIcon,
    hideCancelBtn = false,
    btnSpace = '3',
    isSubmitting = false,
    isCancelDisabled,
    isSubmitDisabled,
    isDisabled,
    isReadonly,
  } = props;
  const getJust = (p: 'left' | 'right' | 'center') => {
    if (p === 'left') return 'justify-start';
    if (p === 'right') return 'justify-end';
    return 'justify-center';
  };

  const mid = () => {
    onSubmit();
  };

  return (
    <Box
      className={`w-full mt-6 flex flex-row items-end gap-${btnSpace} ${getJust(
        position,
      )}`}
    >
      <Box className='flex flex-row-reverse flex-wrap gap-3 pb-3'>
        {!isReadonly && (
          <GenericButton
            className='whitespace-nowrap'
            color='primary'
            startIcon={submitIcon}
            text={submitText}
            onClick={mid}
            disabled={isSubmitting || isSubmitDisabled || isDisabled}
            isLoading={isSubmitting}
          />
        )}
        {!hideCancelBtn && (
          <GenericButton
            className='whitespace-nowrap'
            color='secondary'
            startIcon={cancelIcon}
            text={isReadonly ? 'Close' : cancelText}
            onClick={onCancel}
            disabled={isCancelDisabled}
          />
        )}
      </Box>
    </Box>
  );
};
export default FormBtns;
