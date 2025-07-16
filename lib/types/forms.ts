import { Asset } from './asset';

export type AssetsFormType = {
  assets: Asset[];
};

export type LoginFormType = {
  email: string;
  password: string;
};

export type AdminFormType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type UserFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string; // Opcional para edición, requerido para creación
};
