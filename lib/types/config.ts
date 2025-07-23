export interface Config {
  id?: string;
  key: string;
  value: any;
  type: 'number' | 'string' | 'boolean' | 'object';
  description: string;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfigUpdateService {
  configs: {
    key: string;
    value: any;
    type: 'number' | 'string' | 'boolean' | 'object';
    description: string;
  }[];
} 