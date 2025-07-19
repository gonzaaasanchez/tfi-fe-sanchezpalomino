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

export type PetCharacteristicFormType = {
  name: string;
};

import { Permissions } from './role';

export type RoleFormType = {
  id?: string;
  name: string;
  description?: string;
  permissions: Permissions;
};
export interface FilterField {
  name: string;
  label: string;
  tooltip?: string;
  value?: any;
  component: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

export interface FiltersFormData {
  [key: string]: any;
}

export interface FiltersProps {
  title?: string;
  filters: FilterField[];
  onSubmit: (filters: FiltersFormData) => void;
  onReset: () => void;
  loading?: boolean;
}
