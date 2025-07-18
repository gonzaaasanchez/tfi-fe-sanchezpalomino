// Tipos para permisos dinámicos
export type Action = string;
export type Module = string;
export type Permission = Record<Action, boolean>;
export type Permissions = Record<Module, Permission>;

export interface Role {
  id?: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: Permissions;
  createdAt?: string;
  updatedAt?: string;
}