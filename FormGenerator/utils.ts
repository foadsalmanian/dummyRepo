import { TOpenSnackbar } from 'hooks/useSnackBar';
import { UseFormSetError, Control, UseFormSetFocus } from 'react-hook-form';
import { IFormGenRow, TFormGenRows } from 'types/TFormGen';
import { makeObjectCamelCase } from 'utils/common';

const isDevelopment = process.env.NODE_ENV === 'development';

/* eslint-disable no-console */
export const defOnInvalid = (errs: any, values: any) => {
  if (!isDevelopment) return;
};

export const isElementDisabled = (
  // DEPRECATED
  item: any,
  watchProps: { watchName: string; initialDefaultValue: string | number },
  firstInput,
  isReadonly,
) => {
  if (watchProps && item.name !== watchProps?.watchName) {
    return watchProps?.initialDefaultValue[watchProps.watchName] === firstInput;
  }
  return isReadonly;
};

//------------------------------------------
const deepEqual = (a, b) => {
  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

const cleanObject = obj => {
  const result = {};

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const cleanedSubobject = cleanObject(obj[key]);
        if (Object.keys(cleanedSubobject).length > 0) {
          result[key] = cleanedSubobject;
        }
      } else {
        result[key] = obj[key]; // copy value
      }
    }
  }

  return result;
};

export const compareObjects = (obj1, obj2) => {
  return deepEqual(cleanObject(obj1), cleanObject(obj2));
};

export const setErrors = (
  errors: Record<string, string | Array<string>>,
  setError: UseFormSetError<any>,
  control: Control,
  openSnackBar: TOpenSnackbar,
  setFocus: UseFormSetFocus<any>,
) => {
  const fixedErrors = makeObjectCamelCase(errors);
  const formNames = control?._names?.mount ?? [];
  const unknownErrors = [];

  let toFocusInputName: string;
  for (const error in fixedErrors) {
    let errMess;
    if (Array.isArray(fixedErrors?.[error])) {
      errMess = fixedErrors?.[error]?.[0];
    } else if (typeof fixedErrors?.[error] === 'object') {
      Object.keys(fixedErrors?.[error]).forEach(item => {
        errMess = fixedErrors?.[error]?.[item][0];
      });
    } else {
      errMess = fixedErrors?.[error];
    }

    if ([...formNames].includes(error)) {
      setError(
        error,
        { type: 'custom', message: errMess as string },
        { shouldFocus: true },
      );
      if (!toFocusInputName) toFocusInputName = error;
    } else
      unknownErrors.push(
        error === 'nonFieldError' ||
          error === 'nonFieldErrors' ||
          !isNaN(Number(error))
          ? errMess
          : `${error}: ${errMess}`,
      );
  }
  try {
    setFocus(toFocusInputName, { shouldSelect: true });
    /* eslint-disable no-empty */
  } catch (err) {}
  if (unknownErrors.length > 0) openSnackBar(unknownErrors[0], 'error');
};

export const getCnfInputNames = (cnf: TFormGenRows) => {
  let result = [];

  const finder = (rows: IFormGenRow[]) => {
    const finderResult = [];
    rows.forEach(row => {
      row.forEach(r => {
        finderResult.push(r.name);
      });
    });
    return finderResult;
  };

  cnf.forEach(c => {
    if (!Array.isArray(c)) result = [...result, ...finder(c.children)];
    else result = [...result, finder([c])];
  });

  return result;
};

export const prepFormDefValues = (
  defValues: Record<string, any>,
  inputNames: Array<string>,
) => {
  const defValuesKeys = Object.keys(defValues);
  if (defValuesKeys.length === inputNames.length) return defValues;

  const result = { ...defValues };

  for (const i of inputNames)
    if (!defValuesKeys.includes(i)) result[i] = undefined;

  return result;
};
