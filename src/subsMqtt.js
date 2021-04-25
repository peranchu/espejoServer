//Subscriver MQTT
const mqtt = require('mqtt');

const sub = mqtt.connect('mqtt://localhost:9000', {clientId: 'nodejs'});

sub.on('connect', ()=>{
    sub.subscribe('test');
});

sub.on('message',(topic, message)=>{
    console.log(packet.payload.toString());
})