//PUBLISHER MQTT
const mqtt = require('mqtt');

const pub = mqtt.connect('mqtt://localhost:9000', {clientId: 'nodejs'});

function envioTest(){
    pub.on('connect', ()=>{
        pub.publish('Test', 'Hola desde nodejs');
    });
}


module.exports = {
    envioTest
}