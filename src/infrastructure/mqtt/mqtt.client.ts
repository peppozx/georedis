const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://test.mosquitto.org');
client.on('connect', () => console.log('MQTT client connected'));
client.on('error', (err: any) => { throw err });

export default client;