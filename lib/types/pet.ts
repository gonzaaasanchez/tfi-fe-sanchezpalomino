import { PetCharacteristic } from './petCharacteristic';
import { PetType } from './petType';

export interface Pet {
  id: string;
  name: string;
  petType: PetType;
  characteristics: PetCharacteristic[];
  comment?: string;
  avatar?: string;
}
