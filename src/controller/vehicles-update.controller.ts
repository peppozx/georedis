import { VehicleLocation } from '../interface/vehicle.location.interface';
import mqttClient from '../infrastructure/mqtt/mqtt.client';
import { addVehicleLocation } from '../service/locationService';
import geolib from 'geolib';

const UPDATE_VEHICLE_TOPIC = 'update_vehicle_location';

function setupMQTTController() {
  mqttClient.subscribe(UPDATE_VEHICLE_TOPIC, (err: any) => {
    if (!err) console.log('subscribed to topic');
  
    mqttClient.on('message', async (topic: string, message: Buffer) => {
      console.log(`Received message on topic ${topic}: ${message}`);
  
      const messageString = message.toString('utf-8');
      const updateVehicleLocation = JSON.parse(messageString) as VehicleLocation;
  
      const { current: currentLocation, old: oldLocation } = updateVehicleLocation;
  
      const validCoordinates = geolib.isValidCoordinate({ latitude: currentLocation.latitude, longitude: currentLocation.longitude });
      validCoordinates && await addVehicleLocation({
        id: updateVehicleLocation.id,
        current: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        },
        old: oldLocation && {
          latitude: oldLocation?.latitude,
          longitude: oldLocation?.longitude
        }
      });
    });
  });
}

export {
  setupMQTTController,
}