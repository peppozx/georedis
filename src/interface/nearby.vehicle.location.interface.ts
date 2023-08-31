export interface NearbyVehicleLocation {
  id: string;
  distance: string;
  hash: number;
  coordinates: {
    longitude: string;
    latitude: string;
  }
}