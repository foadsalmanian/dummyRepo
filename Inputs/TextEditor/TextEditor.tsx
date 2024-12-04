import React from 'react';
import { FieldError } from 'react-hook-form';
import ErrShow from 'components/ErrShow/ErrShow';
import dynamic from 'next/dynamic';
import { ResetStyleWrapper } from 'components/pages/notification-templates/preview/PreviewNotificationTemplate.style';

const CKEditor = dynamic(() => import('./CKEditorComponent'), {
  ssr: false,
});

interface ITextEditorProps {
  onChangeValue?: (value: string) => void;
  value?: string;
  ref?: any;
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
  injectionText?: string;
}

const TextEditor = (props: ITextEditorProps): JSX.Element => {
  const {
    onChangeValue,
    value,
    error,
    validationMessage,
    helperText,
    injectionText,
  } = props;

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  return (
    <CKEditor
      value={value}
      onChangeValue={onChangeValue}
      injectionText={injectionText}
      ErrorComponent={ErrShow}
      error={getHelperText()}
      ResetWrapper={ResetStyleWrapper}
    />
  );
};

export default TextEditor;
