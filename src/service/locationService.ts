import { Center } from 'interface/center.interface';
import { RadiusType } from '../enum/radius.type.enum';
import { VehicleLocation } from '../interface/vehicle.location.interface';
import redis, { RedisGeoRadiusOptions } from '../infrastructure/redis/client';
import { NearbyVehicleLocation } from '../interface/nearby.vehicle.location.interface';
import { GRID_CELLS, findGridCell } from '../helpers/grid';

async function addVehicleLocation(vehicleLocation: VehicleLocation): Promise<void> {
  const { current: currentLocation, old: oldLocation } = vehicleLocation;
  const gridCell = findGridCell(currentLocation.latitude, currentLocation.longitude, GRID_CELLS);
  if (!gridCell) throw `Invalid coordinates for vehicle current location`;

  if (oldLocation && oldLocation.latitude && oldLocation.longitude) {
    const previousGridCell = findGridCell(oldLocation.latitude, oldLocation.longitude, GRID_CELLS);
    if (!previousGridCell) throw `Invalid coordinates for vehicle old location`;;

    const { id: previousHash } = previousGridCell;
    const previousBucket = `vehicles-${previousHash}`;
    console.log(`Removing vehicle ${vehicleLocation.id} from previous bucket ${previousBucket}`);
    await redis.zrem(previousBucket, vehicleLocation.id);
  }

  const { id: hash } = gridCell;
  const bucket = `vehicles-${hash}`;
  console.log(`Adding vehicle ${vehicleLocation.id} to bucket ${bucket}`);
  await redis.geoadd(bucket, currentLocation.longitude, currentLocation.latitude, vehicleLocation.id);
}

async function findNearbyVehicles(center: Center, radius: number, radiusType: RadiusType): Promise<NearbyVehicleLocation[]> {
  const gridCell = findGridCell(center.latitude, center.longitude, GRID_CELLS);
  if (!gridCell) throw `No grid cell for center ${center}`;

  const { id: hash } = gridCell;
  const bucket = `vehicles-${hash}`;

  console.log(`Fetching nearby vehicles from bucket ${bucket}`);

  /* This would be a possible solution to getting nearby vehicles using intersected grid cells

    let intersectedGridCells: any[] = [];
    const allNearbyVehicles = [];
    for (const intersectedGridCell of intersectedGridCells) {
      const bucketToFetch = `vehicles-${intersectedGridCell['id']}`;
      const nearbyVehicles = await redis.georadius(bucketToFetch, center.longitude, center.latitude, radius, radiusType, RedisGeoRadiusOptions.WITHCOORD, RedisGeoRadiusOptions.WITHDIST, RedisGeoRadiusOptions.WITHHASH);
      const mappedNearbyVehicles = nearbyVehicles.map((nv: any) => ({
        id: nv?.[0],
        distance: nv?.[1],
        hash: nv?.[2],
        coordinates: {
          longitude: nv?.[3]?.[0],
          latitude: nv?.[3]?.[1],
        },
      }));
      intersectedGridCells = [...intersectedGridCells, mappedNearbyVehicles];
    }

  */

  const nearbyVehicles = await redis.georadius(bucket, center.longitude, center.latitude, radius, radiusType, RedisGeoRadiusOptions.WITHCOORD, RedisGeoRadiusOptions.WITHDIST, RedisGeoRadiusOptions.WITHHASH);
  return nearbyVehicles.map((nv: any) => ({
    id: nv?.[0],
    distance: nv?.[1],
    hash: nv?.[2],
    coordinates: {
      longitude: nv?.[3]?.[0],
      latitude: nv?.[3]?.[1],
    },
  }));
}

export {
  addVehicleLocation,
  findNearbyVehicles,
};