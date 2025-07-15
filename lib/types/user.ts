import { Role } from "./role";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: Role;
  avatar?: string;
  avatarContentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  avatar?: string;
  avatarContentType?: string;
  createdAt?: string;
  updatedAt?: string;
}
