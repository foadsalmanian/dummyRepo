import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GridSize } from '@mui/material';
import { FormGenContainerTypes } from 'components/FormGenerator/consts';
import { TOpenSnackbar } from 'hooks/useSnackBar';
import { Dispatch, SetStateAction } from 'react';
import {
  Control,
  FormState,
  UseFormHandleSubmit,
  UseFormReset,
  RegisterOptions,
  FieldErrors,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
  UseFormClearErrors,
  UseFormSetFocus,
} from 'react-hook-form';

export interface TFormGenReturnType {
  Form: (props: TFormGenProps) => JSX.Element;
  formRequiredProps: TFormRequiredProps;
  reset: UseFormReset<any>;
  fullReset: () => void;
  setError: UseFormSetError<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
  setFocus: UseFormSetFocus<any>;
  fillErrors: (
    errors: Record<string, string | Array<string>>,
    openSnackBar: TOpenSnackbar,
  ) => void;
  clickSubmit: () => void;
  clickCancel: () => void;
  watch: UseFormWatch<any>;
  hookReset: UseFormReset<any>;
}

export interface TFormRequiredProps {
  control?: Control;
  handleSubmit?: UseFormHandleSubmit<any>;
  formState?: FormState<any>;
  isButtonsDisabled?: boolean;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  urlControlCnf?: IFormGenUrlControl;
  externalInputs?: IFGExternalInputControl[];
  fullReset: () => void;
  buttonControls: {
    submit: [boolean, Dispatch<SetStateAction<boolean>>];
    cancel: [boolean, Dispatch<SetStateAction<boolean>>];
  };
  watch: UseFormWatch<any>;
}

export interface IFormGenUrlControl {
  subjects: string[];
  prefix: string;
  encKeys?: string[];
  preUrl?: string;
  exclude?: string[];
  importUrlMdw?: (
    urlObj: Record<string, string | number>,
  ) => Record<string, any>;
  exportUrlMdw?: (
    urlObj: Record<string, any>,
  ) => Record<string, string | number>;
  submitOnImport?: boolean;
}

export interface IFGExternalInputControl {
  value: any;
  setValue: (newVal: any) => void;
  name: string;
  options: Array<
    Partial<
      | 'url' // url control
      | 'reset' // reset on reset
      | 'submit' // include in submit object
    >
  >;
  renderX?: JSX.Element;
}

export type TFormGenRows = Array<IFormGenRow | IFormGenCnt>;

export type IFormGenRow = Array<IFormGenChild>;

export type TFormGenContainerTypeConst = typeof FormGenContainerTypes;

export type TFormGenContainerType =
  TFormGenContainerTypeConst[keyof TFormGenContainerTypeConst];

export interface IFormGenCnt {
  containerType?: TFormGenContainerType;
  containerProps: TContainerProps;
  containerName?: string;
  children: IFormGenRow[];
  containerOptions?: IFormGenRow;
  controlledBy?: string;
  hasConditionalOptions?: boolean;
}

export type TContainerProps = {
  className?: string;
  title?: string;
  isContainerFilled?: boolean;
};

export interface IFormGenChild {
  name: string;
  id?: string;
  isNotAvailable?: boolean;
  labelExtraComponent?: () => JSX.Element;
  type: string;
  as: (props: any) => JSX.Element;
  label?: string;
  placeholder?: string;
  options?: any;
  col?: IFormGenCol;
  rules?: RegisterOptions;
  staticProps?: Record<string, any>;
  getDynamicProps?: (
    control: Control,
    setValue: UseFormSetValue<any>,
  ) => Record<string, any>;
  labelPlacement?: 'top' | 'bottom' | 'end' | 'start';
  className?: string;
  onChangeCallback?: (
    event: any,
    setValue: UseFormSetValue<any>,
    control: Control,
    clearErrors: UseFormClearErrors<any>,
  ) => void;
  isConditionalOption?: boolean;
}

export interface TFormGenProps extends TFormRequiredProps {
  rows: TFormGenRows;
  onSubmit?: (formValues: any) => void;
  onCancel?: () => void;
  className?: string;
  buttonsPosition?: 'left' | 'right' | 'center';
  submitText?: string;
  cancelText?: string;
  submitIcon?: IconProp | any;
  cancelIcon?: IconProp | any;
  FormButtons?: (props: any) => JSX.Element;
  hideButtons?: boolean;
  onInvalidSubmit?: (formErrors: FieldErrors<any>) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isReadonly?: boolean;
  isButtonDisabledWhitNoChange?: boolean;
  scrollTopOnSubmit?: boolean;
  hideBackBtn?: boolean;
  hideCancelBtn?: boolean;
  hasBtnAnchor?: boolean;
  hasNotEnterSubmit?: boolean;
  enableFormOnFieldChange?: string;
}

export interface IFormGenCol {
  xs?: boolean | GridSize;
  sm?: boolean | GridSize;
  md?: boolean | GridSize;
  lg?: boolean | GridSize;
}

export interface IUseFormGenOptions {
  enableButtonsOnChange?: boolean;
  urlControlCnf?: IFormGenUrlControl;
  externalInputs?: IFGExternalInputControl[];
}
