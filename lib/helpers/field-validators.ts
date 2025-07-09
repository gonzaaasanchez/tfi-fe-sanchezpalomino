import { isNil } from 'lodash';

export const emailPattern = (message: string) => ({
  value: /^[\w+-.]+@([\w-]+\.)+[\w-]{2,7}$/g,
  message
});

export const passwordPattern = (message: string) => ({
  value: /(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  message
});

export const urlPattern = (message: string) => ({
  value: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
  message
});

type RequiredSelectParams = {
  key?: string;
  value: any;
  message: string;
};

export const requiredSelect = ({
  value,
  message,
  key = 'id'
}: RequiredSelectParams) => (value && !isNil(value[key])) || message;
