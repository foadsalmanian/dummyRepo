export interface ITranslationsObj {
  [key: string]: {
    value?: string;
    subject?: string;
    message?: any;
    isActive?: boolean;
    isRequired?: boolean;
  };
}
export const notifTranslationsHandleChange = (
  val: ITranslationsObj,
  translations: ITranslationsObj,
  setTranslations: (translations: ITranslationsObj) => void,
  setSubject: (subject: string) => void,
  setMessage: (message: string) => void,
  data: any,
  options: string[],
  requiredLanguages: string[],
) => {
  if (!val) return;
  const customVal = {};
  if (Object.keys(translations ?? {}).length === 0) {
    options?.forEach(code => {
      customVal[code] = {
        subject:
          data?.subject?.filter(i => i.languageCode === code)[0]?.value ?? '',
        message:
          data?.message?.filter(i => i.languageCode === code)[0]?.value ?? '',
        isActive: Object.keys(customVal ?? {}).length === 0,
        isRequired: requiredLanguages.includes(code),
      };
    });
    setTranslations(customVal);
  } else {
    setTranslations(val);
  }
  setSubject(val[getCurrentCode(val)]?.subject);
  setMessage(val[getCurrentCode(val)]?.message);
};

export const baseDataTranslationsHandleChange = (
  val: ITranslationsObj,
  translations: ITranslationsObj,
  setTranslations: (translations: ITranslationsObj) => void,
  setvalue: (subject: string) => void,
  data: any[],
  options: string[],
  mode: string,
  requiredLanguages: string[],
) => {
  if (!val) return;
  const customVal = {};
  if (Object.keys(translations ?? {}).length === 0) {
    options?.forEach(code => {
      customVal[code] = {
        value:
          mode === 'edit' || mode === 'view'
            ? data?.filter(i => i.languageCode === code)[0]?.value.trim() ?? ''
            : '',
        isActive: Object.keys(customVal ?? {}).length === 0,
        isRequired: requiredLanguages.includes(code),
      };
    });

    setTranslations(customVal);
  } else {
    setTranslations(val);
  }

  setvalue(val[getCurrentCode(val)]?.value ?? '');
};

export const getCurrentCode = (translations: ITranslationsObj) => {
  let currentCode = '';
  Object.keys(translations ?? {})?.forEach(tempCode => {
    if (translations[tempCode]?.isActive) {
      currentCode = tempCode;
      return;
    }
  });
  if (!currentCode) {
    return Object.keys(translations ?? {})[0];
  }
  return currentCode;
};

export const getTranslationsOptions = (
  metadata,
  requiredLanguages: string[],
) => {
  return metadata?.language
    ?.filter(item => item.isActive === true)
    .map(item => item.key)
    ?.sort((a, b) =>
      requiredLanguages?.includes(a) && requiredLanguages?.includes(b)
        ? 0
        : requiredLanguages?.includes(a)
        ? -1
        : 1,
    );
};

export const getRequiredLanguages = metadata => {
  return metadata?.language
    ?.filter(item => item.isSystemLanguage === true)
    .map(item => item.key);
};

export const valueHandleChange = (
  val: string,
  translations: ITranslationsObj,
  setValue: (value: string) => void,
  setTranslations: (translations: ITranslationsObj) => void,
) => {
  const vals = {};
  Object.keys(translations ?? {})?.forEach(tempCode => {
    vals[tempCode] =
      getCurrentCode(translations) === tempCode
        ? {
            ...translations[tempCode],
            value: val,
          }
        : translations[tempCode];
  });
  setValue(val);
  setTranslations(vals);
};
