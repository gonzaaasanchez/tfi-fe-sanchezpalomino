export interface Address {
  name: string;
  fullAddress: string;
  floor?: string;
  apartment?: string;
  coords: {
    lat: number;
    lon: number;
  };
}
