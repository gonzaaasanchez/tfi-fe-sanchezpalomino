import { Admin } from './user';
import { Permissions } from './role';

// Admin Services
export type AdminSignInService =
  | Record<'email' | 'password', string>
  | undefined;

export type AdminLoginResponse = {
  admin: Admin;
  token: string;
};

// Auth Services
export type AuthForgotPasswordService = {
  email: string;
  code: string;
  newPassword: string;
};

export type AuthResetPasswordService = {
  password: string;
  code: string;
  newPassword: string;
};

// Role Services

export type RoleCreateService = {
  name: string;
  permissions: Permissions;
};

export type RoleUpdateService = {
  name?: string;
  permissions?: Partial<Permissions>;
};

export type RoleSearchService = {
  search?: string;
  page?: number;
  pageSize?: number;
};

// Admin Services

export type AdminCreateService = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type AdminUpdateService = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  roleId?: string;
  phoneNumber?: string;
  avatar?: File;
};

// User Services

export type UserCreateService = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string; // Requerido para creación
  role: string; // TODO: Este campo se hardcodea con el ID del rol "user" del sistema
};

export type UserUpdateService = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: File;
};

// PetType Services

export type PetTypeCreateService = {
  name: string;
};

export type PetTypeUpdateService = {
  name: string;
};

// Pet Characteristic Services

export type PetCharacteristicCreateService = {
  name: string;
};

export type PetCharacteristicUpdateService = {
  name: string;
};
