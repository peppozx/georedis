import { Center } from 'interface/center.interface';
import { RadiusType } from '../enum/radius.type.enum';
import { VehicleLocation } from '../interface/vehicle.location.interface';
import redis, { RedisGeoRadiusOptions } from '../redis/client';
import { NearbyVehicleLocation } from '../interface/nearby.vehicle.location.interface';

async function addVehicleLocation(vehicleLocation: VehicleLocation): Promise<void> {
  await redis.geoadd('vehicles', vehicleLocation.longitude, vehicleLocation.latitude, vehicleLocation.id);
}

async function findNearbyVehicles(center: Center, radius: number, radiusType: RadiusType): Promise<NearbyVehicleLocation[]> {
  const nearbyVehicles = await redis.georadius('vehicles', center.longitude, center.latitude, radius, radiusType, RedisGeoRadiusOptions.WITHCOORD, RedisGeoRadiusOptions.WITHDIST, RedisGeoRadiusOptions.WITHHASH);
  return nearbyVehicles.map((nv: any) => ({
    id: nv[0],
    distance: nv[1],
    hash: nv[2],
    coordinates: {
      longitude: nv[3][0],
      latitude: nv[3][1],
    },
  }));
}

(async () => {
  await addVehicleLocation({ id: 'vehicle1', longitude: -122.3493, latitude: 47.6205 });
  await addVehicleLocation({ id: 'vehicle2', longitude: -121.3493, latitude: 46.6205 });

  const center: Center = { longitude: -122.3321, latitude: 47.6062 };
  const radius = 999;
  const nearbyVehicles = await findNearbyVehicles(center, radius, RadiusType.KM);

  console.log(nearbyVehicles);
})();

redis;