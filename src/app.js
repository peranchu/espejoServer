const express = require("express");
const ejs = require("ejs");
const Path = require('path');
const Fs = require('fs');
const mosca = require('mosca'); 
const captura = require('../utils/captura');
const { patch } = require("../routes/controles");

const envio = require('./publisMqtt');
const { getPackedSettings } = require("http2");

//Servidor http
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;

//Broker Mosca
var settings = {
  port: 9000,  //puerto para el broker desde node
  http:{
    port:9001,  //puerto para el broker desde el navegador ws
    bundle: true,
    static: './'
  },
  persistence: {
    factory: mosca.persistence.Memory,
  }
};

const broker = new mosca.Server(settings);
/////////////////////////////////////////

//VISTAS DINÁMICAS
app.set('view engine', 'ejs');  //Asignación motor de plantillas
app.set('views', Path.join(__dirname, 'views'));  //Carpeta que sirve plantillas

//STATIC FILES
app.use(express.static(Path.join(__dirname, '../public')));
app.use(express.static(Path.join(__dirname, '../out')));


////////////////// ROUTES  ////////////////////////////////
app.use('/', require('../routes/rutasWeb'));
app.use('/controles', require('../routes/controles'));



//cuando no encuentra la ruta MIDELWARE
app.use((req,res)=>{
  res.sendFile(Path.join(__dirname,'../public/404.html'));
});
//////////////// FIN ROUTES ///////////////////////////


//////////////// BROKER MQTT //////////////////////////////////////
broker.on('ready', ()=>{
  console.log('mosca is ready.');
});

broker.on('clientConnected', (client)=>{
  console.log('Nuevo Cliente: ' + client.id);
});

broker.on('published', (packet, client)=>{
  if(packet.topic.indexOf('echo')=== 0){ 
    return;
  }
  //Configuración mensajes entrantes
  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    reatin: packet.retain || false,
    qos: packet.qos || 0
  };
  console.log('newPacket payload', newPacket.payload.toString());
  broker.publish(newPacket);
});

envio.envioTest();
///////////////////// FIN BROKER MQTT /////////////////////////



//Función que se ejecuta cuando se pulsa el botón de sacar una foto
async function TakePhoto(){
  captura.descarga().then(captura.analisis);  //código asíncrono primero llama a descarga y luego a análisis
}

///////////////////////


//Escucha Puerto Servidor HTTP
server.listen(port, () => {
  console.log("Server started on port" + port);
});

