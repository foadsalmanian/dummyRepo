/* eslint-disable react-hooks/exhaustive-deps */
import FormGenerator from 'components/FormGenerator';
import { setErrors } from 'components/FormGenerator/utils';
import { useState, useEffect, useMemo } from 'react';
import { useForm, UseFormProps, UseFormReset } from 'react-hook-form';
import {
  IFormGenUrlControl,
  IUseFormGenOptions,
  TFormGenReturnType,
} from 'types/TFormGen';
import { TOpenSnackbar } from './useSnackBar';
import { useRouter } from 'next/router';
import { makeObjectCamelCase, updateUrlHelper } from 'utils/common';
import { dePrefixObject } from './utils';

export const emptyUrlControlCnf: IFormGenUrlControl = {
  subjects: [],
  importUrlMdw: null,
  exportUrlMdw: null,
  prefix: '',
  submitOnImport: false,
};

const useFormGenerator = (
  formProps: UseFormProps<any>,
  options?: IUseFormGenOptions,
): TFormGenReturnType => {
  const {
    enableButtonsOnChange = false,
    urlControlCnf = emptyUrlControlCnf,
    externalInputs = [],
  } = options ?? {};
  const {
    control,
    handleSubmit,
    formState,
    reset: hookReset,
    setError,
    setValue,
    watch,
    clearErrors,
    setFocus,
  } = useForm(formProps);
  const router = useRouter();
  const ccQuery = useMemo(
    () => makeObjectCamelCase(router.query),
    [router.isReady],
  );
  const urlCnf: any = useMemo(() => {
    const theCnf = { ...urlControlCnf };
    delete theCnf.subjects;
    delete theCnf.importUrlMdw;
    delete theCnf.exportUrlMdw;
    delete theCnf.submitOnImport;
    return theCnf;
  }, [urlControlCnf]);
  const [urlControlled, setUrlControlled] = useState(false);
  const clickSubmitSt = useState(false);
  const clickCancelSt = useState(false);
  const clickSubmit = () => clickSubmitSt[1](true);

  const clickCancel = () => clickCancelSt[1](true);

  useEffect(() => {
    if (!urlControlCnf?.subjects?.length || urlControlled || !router?.isReady)
      return;
    let insQuery = { ...ccQuery };
    if (urlControlCnf.importUrlMdw)
      insQuery = urlControlCnf.importUrlMdw(
        dePrefixObject(ccQuery, urlControlCnf.prefix),
      );
    for (const i in insQuery) {
      if (urlControlCnf?.subjects?.includes(i)) setValue(i, insQuery[i]);
    }
    for (const i of externalInputs ?? []) {
      if (i.options?.includes('url') && insQuery[i.name])
        i.setValue(insQuery[i.name]);
    }
    setUrlControlled(true);
    if (urlControlCnf?.submitOnImport) clickSubmit();
  }, [router?.isReady]);

  const fillErrors = (
    errors: Record<string, string | Array<string>>,
    openSnackBar: TOpenSnackbar,
  ) => {
    setErrors(errors, setError, control, openSnackBar, setFocus);
  };

  const reset: UseFormReset<any> = (values, keepStateOptions) => {
    hookReset(values, keepStateOptions);
    for (const i of externalInputs ?? []) {
      if (i.options?.includes('reset')) i.setValue(null);
    }
  };

  const fullReset = () => {
    reset();
    let hasExtraReset = false;
    if (externalInputs?.find(ei => ei.options?.includes('reset')))
      hasExtraReset = true;
    if (urlControlCnf?.subjects?.length || hasExtraReset)
      updateUrlHelper(
        router.push,
        router.query,
        {},
        {
          reset: true,
          urlCnf: {
            ...(urlCnf ?? emptyUrlControlCnf),
          },
          isTable: false,
        },
      );
  };

  return {
    Form: FormGenerator,
    reset,
    formRequiredProps: {
      control,
      handleSubmit,
      formState,
      isButtonsDisabled: !enableButtonsOnChange ? false : !formState.isDirty,
      setValue,
      setError,
      clearErrors,
      urlControlCnf,
      fullReset,
      externalInputs,
      buttonControls: {
        submit: clickSubmitSt,
        cancel: clickCancelSt,
      },
      watch,
    },
    watch,
    setError,
    setValue,
    clearErrors,
    setFocus,
    fillErrors,
    fullReset,
    clickSubmit,
    clickCancel,
    hookReset,
  };
};

export default useFormGenerator;
