import React, { SyntheticEvent } from 'react';
import {
  Autocomplete,
  AutocompleteChangeReason,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { uniqBy } from 'lodash';
import { FieldError } from 'react-hook-form';
import { TInputBaseProps } from '../types/inputs';
import ErrShow from 'components/ErrShow/ErrShow';
import { useLocalizer } from 'localizer';

interface IOption {
  text: string;
  value: string | number;
  isActive?: boolean;
}

interface ISuggestibleAutocompleteProps
  extends TInputBaseProps<string, IOption[], IOption | IOption[], IOption> {
  isDisabled?: boolean;
  disableClearable?: boolean;
  limitTags?: number;
  isMultiple?: boolean;
  placeholder?: string;
  label?: string;
  size?: 'small' | 'medium';
  error?: FieldError;
  validationMessage?: string;
  helperText?: string;
  onBlur?: () => void;
  readonly disabled?: boolean;
  onError?: (error) => void;
}

const SuggestibleAutocomplete = (
  props: ISuggestibleAutocompleteProps,
): JSX.Element => {
  const {
    options,
    defaultValue,
    value = [],
    placeholder,
    limitTags,
    disabled,
    isMultiple = true,
    size = 'medium',
    onChangeValue,
    disableClearable = true,
    onError = () => null,
    error,
    validationMessage,
    helperText,
    name,
    inputRef,
  } = props;
  const { t } = useLocalizer();
  const filter = createFilterOptions<IOption>();

  // handleChange: This function handles the change of selection, ensuring that selected values are unique and returning
  // the text of the selection for single select scenarios
  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
  ) => {
    if (isMultiple) {
      onChangeValue(
        uniqBy(value as any, e => {
          return e.text;
        }),
      );
    }
    if (!Array.isArray(value)) {
      onChangeValue(value.text);
    }
  };

  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  // getFinalValue: This function gets the final value for the Autocomplete component based on whether multiple selections are allowed.
  const getFinalValue = () => {
    if (isMultiple) {
      if (Array.isArray(value)) {
        return value;
      }
      return [{ text: value, value: value }];
    }
    if (typeof value === 'string') {
      return { text: value, value: value };
    }
    return value;
  };

  const finaleOptions = () => {
    if (typeof value !== 'string') {
      if (value?.length > 0) {
        let newValues = [];
        for (const element of value) {
          if (!options.find(item => element.value === item.value)) {
            newValues = [
              { value: element?.value, text: element?.text },
              ...newValues,
            ];
          }
        }
        return [...newValues, ...options];
      }
    }
    return options;
  };
  return (
    <Autocomplete
      disabled={disabled}
      multiple={isMultiple}
      limitTags={limitTags ? limitTags : -1}
      id='size-small-outlined-multi-autocomplete'
      options={finaleOptions()}
      getOptionLabel={(option: IOption) => (option ? option?.text : '')}
      defaultValue={defaultValue}
      size={size}
      value={getFinalValue()}
      noOptionsText={t('components.autocomplete.noOptions', 'No Options')}
      onChange={handleChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(option => inputValue === option.text);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            value: inputValue,
            text: inputValue,
          });
        }
        return filtered;
      }}
      disableClearable={disableClearable}
      onError={onError}
      renderInput={params => {
        return (
          <>
            <TextField
              {...params}
              error={error?.message ? !!error : null}
              placeholder={placeholder ?? undefined}
              name={name}
              inputRef={inputRef}
              onChange={e => onChangeValue(e.target.value as any)}
            />
            {!!error?.message && <ErrShow err={getHelperText()} />}
          </>
        );
      }}
      sx={style}
    />
  );
};

const style = {
  '& .MuiOutlinedInput-root': {
    p: 0.37,
  },
  '& .MuiAutocomplete-tag': {
    bgcolor: 'primary.lighter',
    border: '1px solid',
    borderRadius: 1,
    pl: 1.5,
    pr: 1.5,
    lineHeight: '32px',
    borderColor: 'primary.light',
    '& .MuiChip-label': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiSvgIcon-root': {
      color: 'primary.main',
      ml: 1,
      mr: -0.75,
      '&:hover': {
        color: 'primary.dark',
      },
    },
  },
};

export default SuggestibleAutocomplete;
