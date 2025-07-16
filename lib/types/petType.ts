export interface PetType {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PetTypeFormData {
  name: string;
}

export interface GetPetTypesParams {
  page?: number;
  limit?: number;
  search?: string;
}
