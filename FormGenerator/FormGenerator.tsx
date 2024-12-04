/* eslint-disable no-console */
import { TFormGenContainerType, TFormGenProps } from 'types/TFormGen';
import FormBtns from './FormBtns';
import FormContentGenerator from './FormContentGenerator';
import { defOnInvalid } from './utils';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useLocalizer } from 'localizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef } from 'react';
import { updateUrlHelper } from 'utils/common';
import { emptyUrlControlCnf } from 'hooks/useFormGenerator';
import { Box } from '@mui/material';
import { FormGenContainerTypes } from './consts';

const FormGenerator = (props: TFormGenProps) => {
  const {
    rows,
    onSubmit,
    className,
    buttonsPosition,
    submitText,
    cancelText,
    submitIcon,
    cancelIcon,
    onCancel,
    hideButtons = false,
    FormButtons,
    control,
    handleSubmit,
    onInvalidSubmit = defOnInvalid,
    isLoading,
    isSubmitting,
    isReadonly,
    // isButtonDisabledWhitNoChange,
    hideCancelBtn,
    scrollTopOnSubmit,
    isButtonsDisabled,
    setValue,
    setError,
    clearErrors,
    hideBackBtn,
    urlControlCnf = emptyUrlControlCnf,
    externalInputs = [],
    fullReset,
    buttonControls: {
      submit: [submitClick, setSubmit],
      cancel: [cancelClick, setCancel],
    },
    hasBtnAnchor = false,
    hasNotEnterSubmit,
    enableFormOnFieldChange = null,
    watch,
  } = props;
  const router = useRouter();
  const { t } = useLocalizer();
  const formRef = useRef(null);
  const urlCnf: any = useMemo(() => {
    const theCnf = { ...urlControlCnf };
    delete theCnf.subjects;
    delete theCnf.importUrlMdw;
    delete theCnf.exportUrlMdw;
    return theCnf;
  }, [urlControlCnf]);

  const conditionalOptionsCheck = (
    containerType: TFormGenContainerType,
    isConditional: boolean,
  ): boolean => {
    if (containerType === FormGenContainerTypes.CONDITIONAL_CONTAINER)
      return true;
    if (
      containerType === FormGenContainerTypes.ACCORDION_CONTAINER &&
      isConditional
    )
      return true;
    return false;
  };
  const submitForm = () => {
    return handleSubmit((data: any) => {
      const externalValues = {};
      const rowsData = { ...(data ?? {}) };
      for (const i of externalInputs ?? [])
        if (i.options?.includes('submit'))
          externalValues[i.name] = !i.value ? null : i.value;
      for (const i of rows) {
        const isContainer = !Array.isArray(i);
        const shouldModifyData = !isContainer
          ? false
          : conditionalOptionsCheck(i.containerType, i.hasConditionalOptions);
        const container = !isContainer ? null : i;
        if (shouldModifyData) {
          rowsData[container.containerName] = { options: {} };
          for (const j of container.containerOptions) {
            const modName = `${container.containerName}Options${j.name}`;
            rowsData[container.containerName].options[j.name] = data[modName];
            delete rowsData[modName];
          }
          for (const j of container.children) {
            for (const jj of j) {
              const modName = `${container.containerName}${jj.name}`;
              rowsData[container.containerName][jj.name] = data[modName];
              delete rowsData[modName];
            }
          }
        }
      }

      onSubmit({ ...rowsData, ...externalValues });

      let hasExtraQP = false;
      if (externalInputs?.find(ei => ei.options?.includes('url')))
        hasExtraQP = true;

      if (data && (urlControlCnf?.subjects?.length || hasExtraQP)) {
        let urlObj: Record<string, any> = {};
        for (const i of urlControlCnf.subjects)
          urlObj[i] = !data[i] ? null : data[i];
        for (const i of externalInputs ?? [])
          if (i.options?.includes('url'))
            urlObj[i.name] = !i.value ? null : i.value;
        if (urlControlCnf.exportUrlMdw)
          urlObj = urlControlCnf.exportUrlMdw(urlObj);
        updateUrlHelper(router.push, router.query, urlObj, {
          reset: false,
          urlCnf: {
            ...(urlCnf ?? emptyUrlControlCnf),
          },
          isTable: false,
        });
      }
      if (scrollTopOnSubmit)
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, onInvalidSubmit)();
  };

  const handleCancel = () => {
    onCancel();
    fullReset();
  };

  useEffect(() => {
    if (!submitClick) return;
    submitForm();
    setSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitClick]);

  useEffect(() => {
    if (!cancelClick) return;
    handleCancel();
    setCancel(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelClick]);

  const renderButtons = () => {
    if (hideButtons) return null;

    if (isReadonly && !hideBackBtn)
      return (
        <Box className={`w-full flex flex-row items-end justify-end`}>
          <Box className='flex w-fit'>
            <Button
              className='ml-auto'
              onClick={() => {
                if (window.history?.length > 3) router.back();
                else router.push('/' + router.pathname.split('/')[1]);
              }}
              variant='outlined'
              color='primary'
              startIcon={<FontAwesomeIcon icon={['fal', 'arrow-left']} />}
            >
              {t('back')}
            </Button>
          </Box>
        </Box>
      );
    if (FormButtons)
      return (
        <FormButtons
          onSubmit={submitForm}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          isDisabled={isButtonsDisabled}
        />
      );

    return (
      <FormBtns
        isCancelDisabled={isButtonsDisabled}
        isSubmitDisabled={isButtonsDisabled}
        position={buttonsPosition}
        submitText={submitText}
        cancelText={cancelText}
        submitIcon={submitIcon}
        cancelIcon={cancelIcon}
        onCancel={handleCancel}
        onSubmit={submitForm}
        isSubmitting={isSubmitting}
        isDisabled={isButtonsDisabled}
        isReadonly={isReadonly}
        hideCancelBtn={hideCancelBtn}
      />
    );
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
      className={className}
      ref={formRef}
    >
      <FormContentGenerator
        isReadonly={isReadonly}
        isLoading={isLoading}
        data={rows}
        control={control}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        hasBtnAnchor={hasBtnAnchor}
        btnRender={renderButtons}
        submitForm={submitForm}
        hasNotEnterSubmit={hasNotEnterSubmit}
        externalInputs={externalInputs}
        enableFormOnFieldChange={enableFormOnFieldChange}
        watch={watch}
      />
      {!hasBtnAnchor && renderButtons()}
    </form>
  );
};

export default FormGenerator;
