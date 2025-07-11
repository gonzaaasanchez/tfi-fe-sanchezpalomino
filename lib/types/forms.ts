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
