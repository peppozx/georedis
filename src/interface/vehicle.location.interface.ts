export interface VehicleLocation {
  id: string;
  old?: {
    longitude?: number;
    latitude?: number;
  }
  current: {
    longitude: number;
    latitude: number;
  }
}