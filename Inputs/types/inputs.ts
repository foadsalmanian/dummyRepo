import { MutableRefObject } from 'react';
import { FieldError, RefCallBack } from 'react-hook-form';
//---------------------------------------------------------------------------------

export type TDateRangePicker = (string | null)[];

export type TInputBaseProps<T = any, U = undefined, V = T, Z = T> = {
  value?: T;
  type?: string;
  defaultValue?: Z;
  onChangeValue?: (newVal: V) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: any) => void;
  onClick?: (event: any) => void;
  placeholder?: string;
  options?: U;
  error?: FieldError;
  validationMessage?: string;
  readonly disabled?: boolean;
  inputRef?: RefCallBack | MutableRefObject<any>;
  name?: string;
};

export type TDropdownOptions = Array<{
  title?: string;
  key?: string;
  text?: string;
  value?: string | number | null;
  isActive?: boolean;
  color?: { name: string; shade: number };
}>;

export type TAutoComplete =
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'url'
  | 'photo';
