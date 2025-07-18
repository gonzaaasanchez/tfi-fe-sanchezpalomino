import { PetType } from './petType';
import { PetCharacteristic } from './petCharacteristic';

export interface Pet {
  id: string;
  name: string;
  comment?: string;
  avatar?: string;
  petType: PetType;
  characteristics: PetCharacteristic[];
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}
