const express = require("express");
const ejs = require("ejs");
const Path = require('path');
const Fs = require('fs');
const WebSocket = require('ws'); 
const captura = require('../utils/captura');
const { patch } = require("../routes/controles");

//Servidor htpp y websocket
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server: server});
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


//////////////// SOCKET //////////////////////////////////////
wss.on('connection', (ws) =>{
  console.log('Nueva cliente conectado');
  ws.send('Hola cliente');

  ws.on('message', (data) =>{
    console.log('recibido: %s', data);
    //ws.send('mensaje recibido');

    if(data == "PHOTO"){
      TakePhoto();

      setTimeout(()=>{
        wss.clients.forEach((client)=>{
          if(client !== ws && client.readyState === WebSocket.OPEN){
            client.send("REFRESH");
          }
        });
      }, 3000);
    } 
  });


  ws.on('close', ()=>{
    console.log('cliente desconectado');
  });  
});

/////////////////////////////// WS /////////////////////////



//Función que se ejecuta cuando se pulsa el botón de sacar una foto
async function TakePhoto(){
  captura.descarga().then(captura.analisis);  //código asíncrono primero llama a descarga y luego a análisis
}
///////////////////////


//Escucha Puerto Servidor HTTP
server.listen(port, () => {
  console.log("Server started on port" + port);
});

