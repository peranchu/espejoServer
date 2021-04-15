const express = require("express");
const Path = require('path');
const Fs = require('fs');
const captura = require('../utils/captura');
const Websocket = require ('ws');

const app = express();
const port = process.env.PORT || 3000;

//VISTAS DINÁMICAS
app.set('view engine', 'ejs');  //Asignación motor de plantillas
app.set('views', Path.join(__dirname, 'views'));  //Carpeta que sirve plantillas

//STATIC FILES
app.use(express.static(Path.join(__dirname, '../public')));

////////////////// ROUTES  ////////////////////////////////
app.use('/', require('../routes/rutasWeb'));


//cuando no encuentra la ruta
app.use((req,res)=>{
  res.sendFile(Path.join(__dirname,'../public/404.html'));
});
//////////////// FIN ROUTES ///////////////////////////


//////////////// SOCKET //////////////////////////////////////
const wss = new Websocket.Server({port:8080});


//Prepara el servidor ws
wss.on('connection', function connection(ws){
  console.log('conexión establecida');
  

  //Escuchar mensajes clientes conectados al servidor ws
  ws.on('message', function incoming(message){
    console.log('recibido: %s', message);
    if(message == 'PHOTO'){
      TakePhoto();
    }
  });

  //Captura si se produce algún error en la conexion ws
  ws.on('error', err =>{
    console.log('error', err);
  });

  //Captura cuando se cierra la conexión ws con un cliente
  ws.on('close', function stop(){
    console.log('Conexión cerrada');
    ws.terminate();
  });
});
/////////////////////////////// WS /////////////////////////




//Función que se ejecuta cuando se pulsa el botón de sacar una foto
async function TakePhoto(){
  captura.descarga().then(captura.analisis);  //código asíncrono primero llama a descarga y luego a análisis
}
///////////////////////



//Escucha Puerto Servidor 
app.listen(port, () => {
  console.log("Server started on port" + port);
});
