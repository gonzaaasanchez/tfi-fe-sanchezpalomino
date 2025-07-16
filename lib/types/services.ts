// Admin Services
export type AdminSignInService =
  | Record<'email' | 'password', string>
  | undefined;

export type AdminLoginResponse = {
  success: boolean;
  data: {
    admin: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: {
        _id: string;
        name: string;
        description?: string;
        permissions: Record<string, any>;
        isSystem?: boolean;
        createdAt?: string;
        updatedAt?: string;
      };
      avatar?: string;
      avatarContentType?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    token: string;
  };
  message?: string;
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
  newPassword:string;
};

// Role Services
export type RoleGetAllService = {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    description?: string;
    permissions: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
  }>;
  message?: string;
  pagination?: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
};

export type RoleGetByIdService = {
  success: boolean;
  data: {
    id: string;
    name: string;
    description?: string;
    permissions: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
};

export type RoleCreateService = {
  name: string;
  permissions: {
    users?: string[];
    pets?: string[];
    roles?: string[];
    admins?: string[];
    logs?: string[];
    petTypes?: string[];
    petCharacteristics?: string[];
    caregiverSearch?: string[];
    reservations?: string[];
    reviews?: string[];
  };
};

export type RoleUpdateService = {
  name?: string;
  permissions?: Partial<RoleCreateService['permissions']>;
};

export type RoleDeleteService = {
  success: boolean;
  data: {
    id: string;
    name: string;
  };
  message?: string;
};

export type RoleSearchService = {
  search?: string;
  page?: number;
  pageSize?: number;
};

// Admin Services
export type AdminGetAllService = {
  success: boolean;
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
    avatar?: string;
    avatarContentType?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  message?: string;
  pagination?: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
};

export type AdminGetByIdService = {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
    avatar?: string;
    avatarContentType?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
};

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

export type AdminDeleteService = {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
};

// User Services
export type UserGetAllService = {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: {
        id: string;
        name: string;
        description?: string;
      };
      avatar?: string;
      avatarContentType?: string;
      createdAt?: string;
      updatedAt?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
};

export type UserGetByIdService = {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
    avatar?: string;
    avatarContentType?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
};

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

export type UserDeleteService = {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
};

// PetType Services
export type PetTypeGetAllService = {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
};

export type PetTypeGetByIdService = {
  success: boolean;
  data: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
};

export type PetTypeCreateService = {
  name: string;
};

export type PetTypeUpdateService = {
  name: string;
};

export type PetTypeDeleteService = {
  success: boolean;
  data: {
    id: string;
    name: string;
  };
  message?: string;
};
