//PUBLISHER MQTT
const mqtt = require('mqtt');

const pub = mqtt.connect('mqtt://localhost:9000', {clientId: 'nodejs'});

function envioTest(mensaje){
    pub.on('connect', ()=>{
        pub.publish('Test', mensaje);
    });
}


module.exports = {
    envioTest
}