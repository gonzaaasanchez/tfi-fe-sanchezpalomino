import { Role } from "./role";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  avatar?: string;
  avatarContentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  avatar?: string;
  avatarContentType?: string;
  createdAt?: string;
  updatedAt?: string;
}
