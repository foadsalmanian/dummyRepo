import { Divider, Grid } from '@mui/material';
import InputLabel from 'components/Inputs/InputLabel/InputLabel';
import React, { ReactElement } from 'react';
import {
  Control,
  Controller,
  FormState,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import {
  IFGExternalInputControl,
  IFormGenCnt,
  TFormGenRows,
  IFormGenRow,
} from 'types/TFormGen';
import FormContainer from './FormContainer';
import FormGeneratorSkeletonLoading from './FormGeneratorSkeletonLoading';
import { cn } from 'utils/common';
import ConditionalContainer from './ConditionalContainer';
import { FormGenContainerTypes } from './consts';
import AccordionContainer from './AccordionContainer';

interface IFormContentGeneratorProps {
  data: TFormGenRows;
  control: Control<any>;
  readonly isLoading?: boolean;
  readonly isReadonly?: boolean;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  hasBtnAnchor?: boolean;
  btnRender: () => JSX.Element;
  submitForm: () => void;
  hasNotEnterSubmit: boolean;
  externalInputs?: IFGExternalInputControl[];
  enableFormOnFieldChange?: string;
  watch: UseFormWatch<any>;
}

const FormContentGenerator = (
  props: IFormContentGeneratorProps,
): ReactElement => {
  const {
    data,
    control,
    isLoading,
    isReadonly,
    setValue,
    clearErrors,
    hasBtnAnchor,
    btnRender,
    submitForm,
    hasNotEnterSubmit,
    externalInputs,
    enableFormOnFieldChange,
    watch,
  } = props;

  const watchedInput = !enableFormOnFieldChange
    ? null
    : watch(enableFormOnFieldChange);

  const getError = (formSt: FormState<any>, name: string) => {
    const { errors } = formSt;
    const error = errors?.[name];
    if (!error) return null;
    return { message: error.message };
  };

  const getValidationProps = (formSt: FormState<any>, name: string) => {
    const error = getError(formSt, name);
    const validationMessage = formSt?.errors?.[name]?.message ?? '';

    return { error, validationMessage };
  };

  const getDisabledStatus = (fieldName, disabledStaticProp) => {
    if (isReadonly) return true;
    const defaultWatchedValue =
      control?._defaultValues?.[enableFormOnFieldChange];
    if (
      enableFormOnFieldChange &&
      fieldName !== enableFormOnFieldChange &&
      watchedInput === defaultWatchedValue
    )
      return true;

    return !!disabledStaticProp;
  };

  const renderFormRow = (arr: IFormGenRow, idx: number, preName = '') => {
    if (arr.length === 1 && arr[0].type === 'divider')
      return (
        <Grid container key={`formRow${idx}`} className='grid'>
          <Grid
            item
            className={`flex items-end pb-2 pr-4`}
            key={`${preName}divider`}
            lg={24}
            md={24}
            sm={24}
            xs={24}
          >
            <Divider
              component='hr'
              className='bg-gray-300 h-0.5 w-full'
              variant='fullWidth'
            />
          </Grid>
        </Grid>
      );

    const getName = (
      name: string,
      pName: string,
      isConditionalOption = false,
    ) => {
      if (!isConditionalOption) return `${pName}${name}`;
      return `${pName}Options${name}`;
    };
    return (
      <Grid container key={`formRow${idx}`} className='grid sm:flex'>
        {arr.map(item => {
          if (!item.isNotAvailable) {
            if (item.type === 'btnAnchor') {
              if (!hasBtnAnchor) return null;
              return (
                <Grid
                  item
                  className={`flex items-end pb-2 pr-4`}
                  key={`${preName}${item.name}`}
                  lg={item.col?.lg}
                  md={item.col?.md}
                  sm={item.col?.sm ? item.col?.sm : 24}
                  xs={item.col?.xs ? item.col?.xs : 24}
                >
                  {btnRender()}
                </Grid>
              );
            }
            if (item.type === 'inputAnchor')
              return (
                externalInputs.find(ei => ei.name === item.name)?.renderX ??
                null
              );
            if (!item.as) return null;
            return (
              <Grid
                item
                className={`mb-2 ${
                  item.type === 'checkbox' && 'flex justify-start items-center'
                }`}
                key={`${preName}${item.name}`}
                lg={item.col?.lg}
                md={item.col?.md}
                sm={item.col?.sm ? item.col?.sm : 24}
                xs={item.col?.xs ? item.col?.xs : 24}
              >
                <InputLabel
                  {...item}
                  className={cn(
                    'gap-y-1 mb-2',
                    item.type === 'checkbox' && 'max-w-fit',
                    item?.className ?? '',
                  )}
                  label={item.label}
                  name={getName(item.name, preName, item.isConditionalOption)}
                  rules={item.rules}
                  labelPlacement={item.labelPlacement ?? 'top'}
                  disable={
                    item.type === 'checkbox' || item.type === 'multiLing'
                  }
                  col={item.col}
                >
                  <Controller
                    name={getName(item.name, preName, item.isConditionalOption)}
                    control={control}
                    rules={item.rules}
                    defaultValue={item?.staticProps?.defaultValue}
                    render={({
                      field: { onChange, value, onBlur, ref, name },
                      formState,
                    }) => {
                      const Element = item.as;
                      return (
                        <Element
                          disabled={getDisabledStatus(
                            item.name,
                            item.staticProps?.disabled,
                          )}
                          onChangeValue={event => {
                            onChange(event);
                            const onChangeCallback =
                              item.onChangeCallback ??
                              item.staticProps?.onChangeCallback ??
                              null;
                            if (onChangeCallback)
                              onChangeCallback(
                                event,
                                setValue,
                                control,
                                clearErrors,
                              );
                          }}
                          onBlur={onBlur}
                          value={value ?? null}
                          placeholder={item.placeholder ?? ''}
                          options={item.options ?? null}
                          inputRef={ref}
                          name={name}
                          type={item.type}
                          onKeyUp={e => {
                            if (e.key === 'Enter' && !hasNotEnterSubmit)
                              submitForm();
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !hasNotEnterSubmit)
                              submitForm();
                          }}
                          {...getValidationProps(
                            formState,
                            getName(
                              item.name,
                              preName,
                              item.isConditionalOption,
                            ),
                          )}
                          {...item.staticProps}
                          {...(!item.getDynamicProps
                            ? {}
                            : item?.getDynamicProps(control, setValue))}
                        />
                      );
                    }}
                  />
                </InputLabel>
              </Grid>
            );
          }
          return <></>;
        })}
      </Grid>
    );
  };

  const renderFormContainer = (cnt: IFormGenCnt, idxIn: number) => {
    if (cnt.containerType === FormGenContainerTypes.ACCORDION_CONTAINER) {
      return (
        <AccordionContainer {...(cnt.containerProps ?? {})}>
          {cnt.children.map((row, idx: number) =>
            renderFormRow(row, +`${idx}${idxIn}`, cnt.containerName),
          )}
        </AccordionContainer>
      );
    }

    if (cnt.containerType === FormGenContainerTypes.CONDITIONAL_CONTAINER) {
      const cndOptions = renderFormRow(
        cnt.containerOptions,
        +`999${idxIn}`,
        `${cnt.containerName}Options`,
      );
      return (
        <ConditionalContainer
          options={cndOptions}
          hideChildren={
            !control?._formValues?.[
              `${cnt.containerName}Options${cnt.controlledBy}`
            ]
          }
          {...(cnt.containerProps ?? {})}
        >
          {cnt.children.map((row, idx: number) =>
            renderFormRow(row, +`${idx}${idxIn}`, cnt.containerName),
          )}
        </ConditionalContainer>
      );
    }
    return (
      <FormContainer {...(cnt.containerProps ?? {})}>
        {cnt.children.map((row, idx: number) =>
          renderFormRow(row, +`${idx}${idxIn}`),
        )}
      </FormContainer>
    );
  };

  const renderChildren = (arr: TFormGenRows) =>
    arr.map((cnt, idx: number) => {
      if (Array.isArray(cnt)) return renderFormRow(cnt, idx);

      return renderFormContainer(cnt, idx);
    });

  return (
    <>
      {isLoading ? (
        <FormGeneratorSkeletonLoading data={data} />
      ) : (
        renderChildren(data)
      )}
    </>
  );
};

export default FormContentGenerator;
