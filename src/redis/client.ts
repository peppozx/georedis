import { Redis } from 'ioredis';

const redis = new Redis({
  host: 'redis',
  port: 6379,
});

export enum RedisGeoRadiusOptions {
  WITHCOORD = 'WITHCOORD',
  WITHDIST = 'WITHDIST',
  WITHHASH = 'WITHHASH',
}

export default redis;