/* eslint-disable react-hooks/exhaustive-deps */
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteChangeReason,
  TextField,
  CircularProgress,
} from '@mui/material';
import { uniqBy } from 'lodash';
import ErrShow from 'components/ErrShow/ErrShow';
import useWindowSize from 'hooks/useWindowSize';
import { useLocalizer } from 'localizer';
import { IAutoCompleteProps } from './AutoComplete';
import useApi from 'api/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { cn, env } from 'utils/common';

interface ILiveAutoCompleteProps extends IAutoCompleteProps {
  searchUrl: string;
  baseUrl?: string;
  searchWaitTime?: number;
  dataMdw?: (data: any[]) => IOption[];
  params?: {
    [key: string]: unknown;
  };
}

interface IOption {
  text: string;
  value: string | number;
  isActive?: boolean;
}

// This component needs modifications to be able to recieve multiple names (an array of ids), search and load them all

const LiveAutoComplete = (props: ILiveAutoCompleteProps): JSX.Element => {
  const {
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
    hasEmptyOption = false,
    className,
    onBlur,
    onFocus,
    inputRef,
    name,
    onKeyUp,
    searchUrl,
    baseUrl,
    searchWaitTime = 1,
    dataMdw,
    params,
  } = props;

  const { t } = useLocalizer();
  const { width } = useWindowSize();
  const emptyOption = { text: t('phrase.notSet'), value: '' };
  const [options, setOptions] = useState<IOption[]>([]);
  const [searchPhrase, setPhrase] = useState('');
  const [open, setOpen] = useState(false);
  const [waitingForOptions, setWFO] = useState(true);
  const { camelCaseData, refetch, isRefetching, isLoading } = useApi({
    url: searchUrl,
    baseUrl: baseUrl ?? env('APP_API_URL'),
    queryKey: [`live_search_${name}`],
    params: {
      search: searchPhrase,
      ...params,
    },
    load: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open && typeof (value as any) !== 'string') return;
    queryClient.cancelQueries({ queryKey: [`live_search_${name}`] });
    if (!camelCaseData && !searchPhrase) return setWFO(true);
    if (!searchPhrase) return setOptions([]);
    const searchTimer = setTimeout(() => {
      if (waitingForOptions) setWFO(false);
      setOptions([]);
      if (searchPhrase !== 'null') refetch();
    }, searchWaitTime * 100);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [searchPhrase]);

  useEffect(() => {
    // if (!!searchPhrase || typeof (value as any) !== 'string') return;
    setPhrase(value as any);
  }, [value]);

  useEffect(() => {
    let finalData = !camelCaseData ? null : camelCaseData;
    if (dataMdw && finalData) finalData = dataMdw(finalData);
    setOptions(finalData ?? []);
    if (open) return;
    onChangeValue(!finalData?.length ? null : finalData[0]);
  }, [camelCaseData]);

  useEffect(() => {
    const selectedOption = Array.isArray(value)
      ? null
      : options.find(opt => opt.value === (value as any)?.value);
    if (!open && options?.length)
      setOptions(selectedOption ? [selectedOption] : []);
    if (!open && searchPhrase)
      setPhrase(selectedOption ? selectedOption.text : '');
  }, [open]);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
  ) => {
    if (disabled && isMultiple) return null;
    if (!isMultiple) return onChangeValue(value);
    onChangeValue(
      uniqBy(value as any, e => {
        return e.text;
      }),
    );
  };

  const getLimitTag = (): number => {
    if (width < 1301) return 1;
    if (1300 < width && width < 2100) return 2;
    return 3;
  };
  const getHelperText = () => {
    if (!error && !validationMessage) return helperText ?? '';
    if (!error) return validationMessage;
    return error.message;
  };

  const getFinalValue = (): IOption | IOption[] => {
    let finalVal: any = value;
    if (!isMultiple) {
      if (Array.isArray(value)) finalVal = value[0];
    }

    if (!finalVal && hasEmptyOption) finalVal = emptyOption;
    if (isMultiple && !Object.keys(finalVal ?? {}).length && hasEmptyOption)
      finalVal = emptyOption;

    if (isMultiple && !Array.isArray(finalVal)) finalVal = [value];

    if (
      typeof finalVal !== 'string' &&
      typeof finalVal !== 'number' &&
      !isMultiple
    )
      return finalVal;

    const option = getFinalOptions().find(opt => opt.value === finalVal);
    if (option) return option;
    return finalVal as any;
  };

  const getFinalOptions = () => {
    const finalOptions = [];
    if (!searchPhrase) return finalOptions;
    options?.forEach((opt: any) => {
      if (opt.isActive === undefined || opt.isActive) {
        finalOptions.push({
          text: opt.title ?? opt.text,
          value: opt.key ?? opt.value,
        });
      }
    });
    if (!isMultiple && hasEmptyOption) return [emptyOption, ...finalOptions];
    return finalOptions;
  };

  return (
    <MuiAutocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onKeyUp={onKeyUp}
      className={cn(
        '!w-full',
        className,
        disabled && isMultiple && 'opacity-75',
      )}
      filterOptions={x => x}
      multiple={isMultiple}
      limitTags={limitTags ? getLimitTag() : -1}
      id='size-small-outlined-multi-autocomplete'
      options={getFinalOptions()}
      getOptionLabel={(option: IOption) => {
        if (((isRefetching || isLoading) && !open) || !option.text) return '';
        return option.text;
      }}
      defaultValue={defaultValue}
      size={size}
      value={getFinalValue()}
      noOptionsText={t('components.autocomplete.noOptions')}
      disabled={disabled}
      onChange={handleChange}
      disableClearable={disableClearable}
      onError={onError}
      loading={isRefetching || !searchPhrase}
      loadingText={
        !searchPhrase
          ? `${t('phrase.general.search')}...`
          : `${t('phrase.general.loading')}...`
      }
      renderInput={params => (
        <>
          <TextField
            {...params}
            error={error?.message ? !!error : null}
            placeholder={placeholder ?? undefined}
            inputRef={inputRef}
            name={name}
            value={searchPhrase}
            onChange={e => setPhrase(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(isRefetching || isLoading) &&
                  !!searchPhrase &&
                  searchPhrase !== 'null' ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
          {!!error?.message && <ErrShow err={getHelperText()} />}
        </>
      )}
      sx={style(isMultiple)}
      classes={{ popper: disabled && isMultiple ? 'hidden' : '' }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

const style = (isMultiple: boolean) => {
  return {
    '& .MuiOutlinedInput-root': {
      p: isMultiple ? 0.24 : 0.42,
    },
    '& .MuiAutocomplete-tag': {
      bgcolor: 'primary.lighter',
      fontSize: '12px',
      border: '1px solid',
      borderRadius: 1,
      pl: 1.5,
      pr: 1.5,
      py: 0,
      lineHeight: '30px',
      borderColor: 'primary.light',
      '& .MuiChip-label': {
        lineHeight: '25px',
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '0px',
        fontSize: '12px',
      },
      '& .MuiSvgIcon-root': {
        marginTop: '0px',
        color: 'primary.main',
        fontSize: '17px',
        ml: 1,
        mr: -0.75,
        '&:hover': {
          color: 'primary.dark',
        },
      },
    },
  };
};

export default LiveAutoComplete;
