import { isUndefined } from 'lodash';

export const serializeParams = (params: any) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (!isUndefined(value)) {
      if (Array.isArray(value)) {
        value.forEach(v => {
          searchParams.append(`${key}`, v);
        });
      } else {
        searchParams.append(key, value);
      }
    }
  });
  return searchParams.toString();
};
