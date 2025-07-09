import { FieldError, FieldErrors } from 'react-hook-form';

export type FormattedFormError = {
  key: string;
  field: string | string[];
  message?: string;
  messageToTranslate?: string;
};

const getField = (name: string): string | string[] => {
  const formattedName = name
    .split('.')
    .map(fieldName =>
      !isNaN(Number(fieldName)) ? `${Number(fieldName) + 1}` : fieldName
    );

  return formattedName.length > 1 ? formattedName : formattedName[0];
};

export const getFormattedErrors = (errors: FieldErrors<any>) => {
  const formattedFormErrors: FormattedFormError[] = [];

  // If "errors" is an object with a "type" key, it means that it is a single error and not an objet of many errores
  if (errors?.type) {
    errors = {
      error: errors
    };
  }

  for (const key in errors) {
    const error = errors[key] as FieldError;
    if (Array.isArray(error)) {
      if ('root' in error) {
        formattedFormErrors.push({
          key: error.root?.ref?.name!,
          field: getField(error.root?.ref?.name!),
          message: error.root?.message,
          messageToTranslate: 'emptyRoot'
        });
      }
      error.forEach(item => {
        formattedFormErrors.push(...getFormattedErrors(item as FieldErrors));
      });
    } else if (typeof error === 'object' && error.ref) {
      formattedFormErrors.push({
        key: error.ref.name,
        field: getField(error.ref.name),
        message: error.message
      });
    } else if (typeof error === 'object') {
      formattedFormErrors.push(
        ...getFormattedErrors(error as unknown as FieldErrors)
      );
    }
  }

  return formattedFormErrors;
};
