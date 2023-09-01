import * as teste from './service/locationService';
import mqttClient from './mqtt/mqtt.client';

teste
mqttClient

mqttClient.subscribe('update_vehicle_location', (err: any) => {
  if (!err) {
    console.log('subscribed to topic');
  }
  mqttClient.on('message', (topic: any, message: any) => {
    console.log(`Received message on topic ${topic}: ${message}`);
  });
  
  mqttClient.publish('update_vehicle_location', JSON.stringify({ id: 'vehicle1', latitude: 1, longitude: 2 }), { qos: 0 }, () => {
    console.log('Published message to topic: update_vehicle_location');
  });
});