export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions: {
    users: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    roles: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    admins: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    logs: {
      read: boolean;
      getAll: boolean;
    };
    petTypes: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    petCharacteristics: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    pets: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      getAll: boolean;
    };
    caregiverSearch: {
      read: boolean;
    };
    reservations: {
      create: boolean;
      read: boolean;
      update: boolean;
      admin: boolean;
    };
    reviews: {
      create: boolean;
      read: boolean;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}