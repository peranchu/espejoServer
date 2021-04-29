const express = require("express");
const ejs = require("ejs");
const Path = require('path');
const Fs = require('fs');
const mosca = require('mosca'); 
const captura = require('../utils/captura');
const { patch } = require("../routes/controles");
const mqtt = require('mqtt');
//const cliente = require('./client_mqtt');

//Servidor http
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;
////////////////////////////////////////////////////

var subscripcion = "";  //Almacena los topic MQTT
var mensaje = "";      //almacena los mensajes MQTT

//////// Broker Mosca  ////////////////////
//Configuración Broker
var settings = {
  port: 9000,   //puerto para el broker desde node - Microcontroladores
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

broker.on('ready', ()=>{
  console.log('mosca is ready.');
});

//Clientes que se conectan
broker.on('clientConnected', (client)=>{
  console.log('Nuevo Cliente: ' + client.id);
});
//////////// FIN BROKER MOSCA ////////////////////////////

//VISTAS DINÁMICAS
app.set('view engine', 'ejs');  //Asignación motor de plantillas
app.set('views', Path.join(__dirname, 'views'));  //Carpeta que sirve plantillas

//STATIC FILES
app.use(express.static(Path.join(__dirname, '../public')));
app.use(express.static(Path.join(__dirname, '../out')));
app.use(express.static(Path.join(__dirname, '../sass')));


////////////////// ROUTES  ////////////////////////////////
app.use('/', require('../routes/rutasWeb'));
app.use('/controles', require('../routes/controles'));



//cuando no encuentra la ruta MIDELWARE
app.use((req,res)=>{
  res.sendFile(Path.join(__dirname,'../public/404.html'));
});
//////////////// FIN ROUTES ///////////////////////////


//////////////// MQTT CLIENT//////////////////////////////////////
const client = mqtt.connect('mqtt://localhost:9000', {clientId: 'nodejs'});

//Subscricpciones
client.on('connect', function(){
  client.subscribe('interface', function(err){
    if(!err){
      console.log('subscrito a interface');
    }
  });
});

//Mensajes recibidos
client.on('message', function(topic, message){
  console.log(message.toString());
  if(topic == 'interface' && message == 'PHOTO'){
    subscripcion = 'Refresh';
    mensaje = "REFRESH";
    TakePhoto(subscripcion, mensaje);
  }
});

//Publicacion Mensajes MQTT
async function publicar(subscripcion, message){
  client.publish(subscripcion, message);
}

///////////////////// FIN BROKER MQTT /////////////////////////



//Función que se ejecuta cuando se pulsa el botón de sacar una foto
//código asíncrono primero llama a descarga y luego a análisis
async function TakePhoto(subscripcion, mensaje){
  await captura.descarga();
  await captura.analisis();
  publicar(subscripcion, mensaje);  //Mensaje Refresco Navegador
}
///////////////////////


//Escucha Puerto Servidor HTTP
server.listen(port, () => {
  console.log("Server started on port" + port);
});

